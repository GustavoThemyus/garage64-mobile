// Verificação do motor de cálculo e das regras. Não há test runner no projeto,
// então isto é um script simples: roda com `npm run verify:engine` e falha
// (código de saída 1) se qualquer invariante quebrar.
import { carsMoch } from "../src/data/carsMoch";
import { FACTORY_ID, getPartOptions } from "../src/data/partsCatalog";
import { normalizeAspiration } from "../src/engine/aspiration";
import { calculateBuild } from "../src/engine/calculate";
import { compareCars } from "../src/engine/compare";
import { getConfigRanges, getFactoryConfig } from "../src/engine/config";
import { EMPTY_BUILD_FILTERS, filterBuilds, hasActiveBuildFilters } from "../src/engine/filterBuilds";
import { evaluateBuild } from "../src/engine/evaluate";
import { validateBuild } from "../src/engine/validate";
import { parseBuilds } from "../src/storage/parseBuilds";
import { Build, PartField } from "../src/types/build";

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

  // 1. A configuração de fábrica reproduz o mock exatamente.
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

  // 2. O carro de fábrica nunca gera aviso.
  const warnings = validateBuild(car, factory);
  check(
    `${label}: factory has no warnings`,
    warnings.length === 0,
    warnings.map((w) => w.code).join(","),
  );

  // 3. Texto de aspiração do mock é reconhecido (pega erro de digitação nos dados).
  check(`${label}: specs.aspiration recognized`, normalizeAspiration(car.specs.aspiration) !== null);
  for (const text of car.rules.allowedAspirations) {
    check(`${label}: rules aspiration "${text}" recognized`, normalizeAspiration(text) !== null);
  }

  // 4. Os controles começam dentro da faixa do slider.
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

  // 5. Mais cilindrada ou NOS nunca reduz a potência.
  const bigger = calculateBuild(car, { ...factory, displacement: factory.displacement + 0.5 });
  check(`${label}: more displacement keeps hp`, bigger.performance.hp >= result.hp);
  check(`${label}: more displacement adds weight`, bigger.weightKg > weightKg);
  const nos = calculateBuild(car, { ...factory, nos: true });
  check(`${label}: NOS raises hp`, nos.performance.hp > result.hp);
  check(`${label}: NOS does not change weight`, nos.weightKg === weightKg);

  // 6. Forçar a indução aumenta a potência, na ordem esperada.
  const power = (aspiration: typeof factory.aspiration) =>
    calculateBuild(car, { ...factory, aspiration }).performance.hp;
  check(
    `${label}: aspiration power order`,
    power("naturally-aspirated") <= power("supercharged") &&
      power("supercharged") <= power("single-turbo") &&
      power("single-turbo") <= power("twin-turbo"),
  );

  // 7. Toda opção de peça tem id único e começa por "factory".
  for (const field of PART_FIELDS) {
    const options = getPartOptions(car, field);
    check(`${label}: ${field} starts with factory`, options[0].id === FACTORY_ID);
    check(
      `${label}: ${field} option ids are unique`,
      new Set(options.map((o) => o.id)).size === options.length,
    );
  }
}

// 8. As regras disparam os avisos certos.
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

// 9. O comparador é simétrico e sempre tem um melhor.
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

// 10. Ler builds salvas nunca quebra, mesmo com dado corrompido.
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

// 11. Filtro de builds: critérios opcionais e combináveis.
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

console.log(`${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  throw new Error(`${failures} engine check(s) failed`);
}
