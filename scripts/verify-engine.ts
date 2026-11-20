// Roda com `npm run verify:engine`. Sai com código 1 se qualquer invariante quebrar (o projeto não tem test runner).
import { carsMoch } from "../src/data/carsMoch";
import { FACTORY_ID, getPartOptions } from "../src/data/partsCatalog";
import { normalizeAspiration } from "../src/engine/aspiration";
import { calculateBuild } from "../src/engine/calculate";
import { compareCars } from "../src/engine/compare";
import { getConfigRanges, getFactoryConfig } from "../src/engine/config";
import { EMPTY_BUILD_FILTERS, filterBuilds, hasActiveBuildFilters } from "../src/engine/filterBuilds";
import { buildBuildFilterModel, buildCarFilterModel } from "../src/components/filters/filterModels";
import { FilterCriteria } from "../src/data/filterCars";
import { evaluateBuild } from "../src/engine/evaluate";
import { validateBuild } from "../src/engine/validate";
import { localCarsRepository } from "../src/data/carsRepository";
import { createHttpAssistantService, AssistantUnavailableError, offlineAssistantService } from "../src/services/assistant";
import { buildFromDraft } from "../src/storage/buildFromDraft";
import { createMemoryBuildsRepository } from "../src/storage/buildsRepository";
import { parseBuilds } from "../src/storage/parseBuilds";
import { Build, BuildDraft, PartField } from "../src/types/build";

let failures = 0;
let checks = 0;

function check(name: string, ok: boolean, detail = "") {
  checks += 1;
  if (!ok) {
    failures += 1;
    console.log(`FAIL  ${name}${detail ? `  ${detail}` : ""}`);
  }
}

const find = (id: number) => carsMoch.find((car) => car.info.id === id)!;
const PART_FIELDS: PartField[] = ["transmission", "wheels", "steering", "brakes"];

for (const car of carsMoch) {
  const label = car.info.model;
  const factory = getFactoryConfig(car);
  const { performance: result, weightKg } = calculateBuild(car, factory);
  const base = car.performance;

  // fábrica reproduz o mock
  check(`${label}: factory hp`, result.hp === base.hp);
  check(`${label}: factory torque`, result.torque[0] === base.torque[0]);
  check(
    `${label}: factory top speed`,
    result.topSpeed[0] === base.topSpeed[0] &&
      result.topSpeed[1] === base.topSpeed[1],
  );
  check(`${label}: factory 0-100`, result.acceleration === base.acceleration);
  check(`${label}: factory consumption`, result.consumption === base.consumption);
  check(`${label}: factory weight`, weightKg === car.specs.weight[0]);

  // fábrica nunca gera aviso
  const warnings = validateBuild(car, factory);
  check(
    `${label}: factory has no warnings`,
    warnings.length === 0,
    warnings.map((w) => w.code).join(","),
  );

  // texto de aspiração do mock é reconhecido
  check(`${label}: specs.aspiration recognized`, normalizeAspiration(car.specs.aspiration) !== null);
  for (const text of car.rules.allowedAspirations) {
    check(`${label}: rules aspiration "${text}" recognized`, normalizeAspiration(text) !== null);
  }

  // controles começam dentro da faixa do slider
  const ranges = getConfigRanges(car);
  check(
    `${label}: displacement inside slider range`,
    factory.displacement >= ranges.displacement.min - 1e-9 &&
      factory.displacement <= ranges.displacement.max + 1e-9,
  );
  check(
    `${label}: valves range matches engine`,
    car.specs.valves === 0
      ? ranges.valves === null
      : ranges.valves !== null &&
          factory.valves >= ranges.valves.min &&
          factory.valves <= ranges.valves.max,
  );

  // mais cilindrada ou NOS nunca reduz a potência
  const bigger = calculateBuild(car, { ...factory, displacement: factory.displacement + 0.5 });
  check(`${label}: more displacement keeps hp`, bigger.performance.hp >= result.hp);
  check(`${label}: more displacement adds weight`, bigger.weightKg > weightKg);
  const nos = calculateBuild(car, { ...factory, nos: true });
  check(`${label}: NOS raises hp`, nos.performance.hp > result.hp);
  check(`${label}: NOS does not change weight`, nos.weightKg === weightKg);

  // ordem de potência das aspirações
  const power = (aspiration: typeof factory.aspiration) =>
    calculateBuild(car, { ...factory, aspiration }).performance.hp;
  check(
    `${label}: aspiration power order`,
    power("naturally-aspirated") <= power("supercharged") &&
      power("supercharged") <= power("single-turbo") &&
      power("single-turbo") <= power("twin-turbo"),
  );

  // opções de peça: ids únicos e "factory" primeiro
  for (const field of PART_FIELDS) {
    const options = getPartOptions(car, field);
    check(`${label}: ${field} starts with factory`, options[0].id === FACTORY_ID);
    check(
      `${label}: ${field} option ids are unique`,
      new Set(options.map((o) => o.id)).size === options.length,
    );
  }
}

// regras disparam os avisos certos
const civic = find(5);
const civicFactory = getFactoryConfig(civic);
const codes = (car: typeof civic, config: typeof civicFactory) =>
  validateBuild(car, config).map((w) => w.code);

check("Civic: twin turbo is not allowed", codes(civic, { ...civicFactory, aspiration: "twin-turbo" }).includes("aspiration-not-allowed"));
check("Civic: single turbo is allowed", !codes(civic, { ...civicFactory, aspiration: "single-turbo" }).includes("aspiration-not-allowed"));
check("Civic: AWD is not supported", codes(civic, { ...civicFactory, awd: true }).includes("awd-not-supported"));

const porsche = find(3);
check("911: NOS is not supported", codes(porsche, { ...getFactoryConfig(porsche), nos: true }).includes("nos-not-supported"));

const skyline = find(1);
check("Skyline: removing AWD flags the traction change", codes(skyline, { ...getFactoryConfig(skyline), awd: false }).includes("traction-change-not-allowed"));

const alpine = find(14);
const alpineBoosted = { ...getFactoryConfig(alpine), aspiration: "single-turbo" as const, nos: true };
check("Alpine: boosted past maxHP warns", codes(alpine, alpineBoosted).includes("hp-over-limit"));

// comparador simétrico
const a = carsMoch[0];
const b = find(5);
check("compare: same car ties", compareCars(a, a).every((r) => r.winner === "tie"));
const ab = compareCars(a, b);
const ba = compareCars(b, a);
check(
  "compare: swapping A and B swaps the winner",
  ab.every((r, i) => r.winner === "tie" || r.winner === (ba[i].winner === "a" ? "b" : "a")),
);
check("compare: one side always scores 1", ab.every((r) => Math.max(r.a.score, r.b.score) === 1));

// leitura de builds salvas
const evaluated = evaluateBuild(civic, { ...civicFactory, aspiration: "twin-turbo" });
const sample: Build = {
  id: "abc123",
  carId: civic.info.id,
  name: "Weekend Civic",
  config: { ...civicFactory, aspiration: "twin-turbo" },
  computed: evaluated.performance,
  warnings: evaluated.warnings,
  createdAt: "2026-01-01T00:00:00.000Z",
};
check("storage: round trip keeps the build", JSON.stringify(parseBuilds(JSON.stringify([sample]))) === JSON.stringify([sample]));
check("storage: null gives an empty list", parseBuilds(null).length === 0);
check("storage: broken JSON gives an empty list", parseBuilds("{not json").length === 0);
check("storage: non-array gives an empty list", parseBuilds('{"id":"x"}').length === 0);
check("storage: drops only the invalid items", parseBuilds(JSON.stringify([sample, { id: 1 }, null, sample])).length === 2);
check("storage: rejects an unknown aspiration", parseBuilds(JSON.stringify([{ ...sample, config: { ...sample.config, aspiration: "warp-drive" } }])).length === 0);
check("storage: rejects a malformed result", parseBuilds(JSON.stringify([{ ...sample, computed: { hp: 1 } }])).length === 0);

// filtro de builds
const makeBuild = (id: string, car: typeof civic, patch: Partial<typeof civicFactory>): Build => {
  const config = { ...getFactoryConfig(car), ...patch };
  const evaluation = evaluateBuild(car, config);
  return { id, carId: car.info.id, name: id, config, computed: evaluation.performance, warnings: evaluation.warnings, createdAt: "2026-01-01T00:00:00.000Z" };
};
const stock = makeBuild("civic-stock", civic, {});
const boosted = makeBuild("civic-boosted", civic, { aspiration: "single-turbo", nos: true });
const invalid = makeBuild("civic-awd", civic, { awd: true });
const gtr = makeBuild("skyline-stock", skyline, {});
const all = [stock, boosted, invalid, gtr];
const ids = (list: Build[]) => list.map((b) => b.id).join(",");

check("filterBuilds: empty criteria keeps everything", filterBuilds(all, EMPTY_BUILD_FILTERS, carsMoch).length === 4);
check("filterBuilds: empty criteria is inactive", !hasActiveBuildFilters(EMPTY_BUILD_FILTERS));
check("filterBuilds: by base car", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, carIds: [skyline.info.id] }, carsMoch)) === "skyline-stock");
check("filterBuilds: by brand", filterBuilds(all, { ...EMPTY_BUILD_FILTERS, brands: ["Honda"] }, carsMoch).length === 3);
check("filterBuilds: two brands add up (OR)", filterBuilds(all, { ...EMPTY_BUILD_FILTERS, brands: ["Honda", "Nissan"] }, carsMoch).length === 4);
check("filterBuilds: only compatible", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, compatibility: "compatible" }, carsMoch)) === "civic-stock,civic-boosted,skyline-stock");
check("filterBuilds: only with warnings", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, compatibility: "warnings" }, carsMoch)) === "civic-awd");
check("filterBuilds: hp range 200-300 holds the boosted Civic", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, hpRange: "200-300" }, carsMoch)).includes("civic-boosted"));
check("filterBuilds: hp range under 200 holds the stock Civic", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, hpRange: "under-200" }, carsMoch)).includes("civic-stock"));
check("filterBuilds: criteria combine (AND)", ids(filterBuilds(all, { ...EMPTY_BUILD_FILTERS, brands: ["Honda"], compatibility: "compatible", hpRange: "200-300" }, carsMoch)) === "civic-boosted");
check("filterBuilds: no match gives an empty list", filterBuilds(all, { ...EMPTY_BUILD_FILTERS, brands: ["Honda"], hpRange: "over-400" }, carsMoch).length === 0);

// modelo de filtro: o balão e o painel leem o mesmo
const emptyCarFilters: FilterCriteria = { selectedBrand: [], selectedType: [], selectedCountry: [] };
const calls: string[] = [];
const carModel = buildCarFilterModel({
  cars: carsMoch,
  filters: emptyCarFilters,
  onToggle: (category, value) => calls.push(`${category}:${value}`),
  onClear: () => calls.push("clear"),
  resultCount: 14,
});
check("filter model: catalog has brand, country and type", carModel.sections.map((x) => x.id).join(",") === "brand,country,type");
check("filter model: result label is plural", carModel.resultLabel === "14 cars");
check("filter model: one result is singular", buildCarFilterModel({ cars: carsMoch, filters: emptyCarFilters, onToggle: () => {}, onClear: () => {}, resultCount: 1 }).resultLabel === "1 car");
check("filter model: nothing selected is inactive", !carModel.active && !carModel.canClear);
check("filter model: brand options are the 13 distinct brands", carModel.sections[0].options.length === new Set(carsMoch.map((c) => c.info.brand)).size);
check("filter model: country shows names, not codes", carModel.sections[1].options.some((o) => o.value === "JP" && o.label === "Japan"));
const brandSection = carModel.sections[0];
if (brandSection.kind === "multi") brandSection.onToggle("Nissan");
check("filter model: toggling a brand reports the right category", calls.join() === "selectedBrand:Nissan");
const selectedModel = buildCarFilterModel({ cars: carsMoch, filters: { ...emptyCarFilters, selectedBrand: ["Nissan"] }, onToggle: () => {}, onClear: () => {}, resultCount: 2 });
check("filter model: a selection makes it active and clearable", selectedModel.active && selectedModel.canClear);
check("filter model: selected state is passed to the section", selectedModel.sections[0].kind === "multi" && (selectedModel.sections[0] as any).selected.join() === "Nissan");

let lastCriteria = EMPTY_BUILD_FILTERS;
const buildModelFor = (criteria: typeof EMPTY_BUILD_FILTERS) =>
  buildBuildFilterModel({ cars: carsMoch, builds: all, criteria, onChange: (next) => { lastCriteria = next; }, onClear: () => {}, resultCount: 3 });
const buildModel = buildModelFor(EMPTY_BUILD_FILTERS);
check("filter model: builds has car, brand, power and compatibility", buildModel.sections.map((x) => x.id).join(",") === "base-car,brand,power,compatibility");
check("filter model: build car options only list cars with a build", buildModel.sections[0].options.map((o) => o.label).sort().join(",") === "Civic EG6,Skyline GT-R R34");
check("filter model: build brand options only list brands with a build", buildModel.sections[1].options.map((o) => o.value).sort().join(",") === "Honda,Nissan");
check("filter model: power has the five ranges", buildModel.sections[2].options.length === 5);
const carSection = buildModel.sections[0];
if (carSection.kind === "multi") carSection.onToggle(String(civic.info.id));
check("filter model: toggling a base car converts the id back to a number", lastCriteria.carIds.join() === String(civic.info.id));
const toggledOff = buildModelFor({ ...EMPTY_BUILD_FILTERS, carIds: [civic.info.id] }).sections[0];
if (toggledOff.kind === "multi") toggledOff.onToggle(String(civic.info.id));
check("filter model: toggling the same car again removes it", lastCriteria.carIds.length === 0);
const powerSection = buildModel.sections[2];
if (powerSection.kind === "single") powerSection.onChange("200-300");
check("filter model: choosing a power range sets only that criterion", lastCriteria.hpRange === "200-300" && lastCriteria.compatibility === "all");

// rascunho para build
const draft: BuildDraft = {
  carId: civic.info.id,
  name: "  Weekend Civic  ",
  config: civicFactory,
  computed: evaluated.performance,
  warnings: evaluated.warnings,
};
const created = buildFromDraft(draft, undefined, new Date("2026-03-01T10:00:00.000Z"), () => "id-1");
check("draft: new build gets a generated id", created.id === "id-1");
check("draft: new build gets the creation date", created.createdAt === "2026-03-01T10:00:00.000Z");
check("draft: the name is trimmed", created.name === "Weekend Civic");
const edited = buildFromDraft({ ...draft, id: created.id, name: "Renamed" }, created, new Date("2027-01-01T00:00:00.000Z"), () => "id-2");
check("draft: editing keeps the id", edited.id === "id-1");
check("draft: editing keeps the creation date", edited.createdAt === created.createdAt);
check("draft: editing applies the new name", edited.name === "Renamed");

// contrato do repositório de builds
async function checkRepositoryContract() {
  const repo = createMemoryBuildsRepository();
  await repo.save(stock);
  await repo.save(boosted);
  check("repository: new builds go to the front", (await repo.list()).map((b) => b.id).join(",") === "civic-boosted,civic-stock");
  await repo.save({ ...stock, name: "Renamed stock" });
  const afterUpdate = await repo.list();
  check("repository: saving an existing id updates, never duplicates", afterUpdate.length === 2 && afterUpdate.find((b) => b.id === "civic-stock")?.name === "Renamed stock");
  await repo.remove("civic-boosted");
  check("repository: remove deletes only that build", (await repo.list()).map((b) => b.id).join(",") === "civic-stock");
  await repo.remove("does-not-exist");
  check("repository: removing an unknown id is harmless", (await repo.list()).length === 1);
  const seeded = createMemoryBuildsRepository([stock]);
  const listed = await seeded.list();
  listed.pop();
  check("repository: list returns a copy", (await seeded.list()).length === 1);
}

// catálogo local
async function checkCatalog() {
  check("catalog: local repository has initial cars", localCarsRepository.initialCars?.length === carsMoch.length);
  check("catalog: getCars matches the mock", (await localCarsRepository.getCars()).length === carsMoch.length);
}

// serviço do assistente, com fetch simulado
async function checkAssistant() {
  const realFetch = globalThis.fetch;
  let lastRequest: { url: string; body: any } | null = null;
  const stub = (response: () => Promise<Response>) => {
    globalThis.fetch = (async (url: any, init: any) => {
      lastRequest = { url: String(url), body: JSON.parse(init.body) };
      return response();
    }) as typeof fetch;
  };
  const json = (status: number, body: unknown) => async () =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  const service = createHttpAssistantService("https://api.example.com");
  const history = [
    { id: "1", role: "user" as const, text: "hi" },
    { id: "2", role: "assistant" as const, text: "offline", isError: true },
    { id: "3", role: "assistant" as const, text: "hello" },
  ];
  const fails = async (run: () => Promise<string>) => {
    try { await run(); return false; } catch (error) { return error instanceof AssistantUnavailableError; }
  };

  try {
    stub(json(200, { reply: "Skyline answer" }));
    check("assistant: returns the reply", (await service.sendMessage(history, "next")) === "Skyline answer");
    const sent = lastRequest as unknown as { url: string; body: { messages: { role: string; text: string }[] } };
    check("assistant: posts to /api/assistant", sent.url === "https://api.example.com/api/assistant");
    check("assistant: ends with the new user message", sent.body.messages.at(-1)?.text === "next" && sent.body.messages.at(-1)?.role === "user");
    check("assistant: error messages are not sent as history", !sent.body.messages.some((m) => m.text === "offline"));
    check("assistant: only role and text are sent", sent.body.messages.every((m) => Object.keys(m).sort().join() === "role,text"));

    stub(json(500, { reply: "x" }));
    check("assistant: non-200 becomes AssistantUnavailableError", await fails(() => service.sendMessage([], "x")));
    stub(json(200, { nope: true }));
    check("assistant: a malformed body is rejected", await fails(() => service.sendMessage([], "x")));
    stub(json(200, { reply: "" }));
    check("assistant: an empty reply is rejected", await fails(() => service.sendMessage([], "x")));
    stub(async () => { throw new TypeError("Network request failed"); });
    check("assistant: a network failure becomes AssistantUnavailableError", await fails(() => service.sendMessage([], "x")));
    check("assistant: the offline service always refuses", await fails(() => offlineAssistantService.sendMessage([], "x")));
  } finally {
    globalThis.fetch = realFetch;
  }
}

// main() porque o tsx compila como CommonJS, sem await no topo; uma rejeição sai com código 1.
async function main() {
  await checkRepositoryContract();
  await checkCatalog();
  await checkAssistant();

  console.log(`${checks - failures}/${checks} checks passed`);
  if (failures > 0) {
    throw new Error(`${failures} engine check(s) failed`);
  }
}

void main();
