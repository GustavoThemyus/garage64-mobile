import { Build } from "../types/build";
import { Car } from "../types/car";

export type HpRangeId = "any" | "under-200" | "200-300" | "300-400" | "over-400";

// Faixas no formato [min, max): 300 entra em "300-400", não em "200-300".
export const HP_RANGES: { id: HpRangeId; label: string; min: number; max: number }[] =
  [
    { id: "any", label: "Any", min: 0, max: Infinity },
    { id: "under-200", label: "Under 200", min: 0, max: 200 },
    { id: "200-300", label: "200 to 300", min: 200, max: 300 },
    { id: "300-400", label: "300 to 400", min: 300, max: 400 },
    { id: "over-400", label: "400 and up", min: 400, max: Infinity },
  ];

export type CompatibilityFilter = "all" | "compatible" | "warnings";

// Todos os critérios são opcionais e se combinam (spec 11.5). Lista vazia, "any"
// e "all" significam "não filtra por isso". Dentro de uma lista é OU (Nissan ou
// Toyota); entre critérios diferentes é E.
export type BuildFilterCriteria = {
  carIds: number[];
  brands: string[];
  hpRange: HpRangeId;
  compatibility: CompatibilityFilter;
};

export const EMPTY_BUILD_FILTERS: BuildFilterCriteria = {
  carIds: [],
  brands: [],
  hpRange: "any",
  compatibility: "all",
};

export function hasActiveBuildFilters(criteria: BuildFilterCriteria): boolean {
  return (
    criteria.carIds.length > 0 ||
    criteria.brands.length > 0 ||
    criteria.hpRange !== "any" ||
    criteria.compatibility !== "all"
  );
}

export function filterBuilds(
  builds: Build[],
  criteria: BuildFilterCriteria,
  cars: Car[],
): Build[] {
  const brandOf = new Map(cars.map((car) => [car.info.id, car.info.brand]));
  const range = HP_RANGES.find((item) => item.id === criteria.hpRange)!;

  return builds.filter((build) => {
    if (criteria.carIds.length > 0 && !criteria.carIds.includes(build.carId)) {
      return false;
    }
    if (
      criteria.brands.length > 0 &&
      !criteria.brands.includes(brandOf.get(build.carId) ?? "")
    ) {
      return false;
    }
    if (build.computed.hp < range.min || build.computed.hp >= range.max) {
      return false;
    }
    if (criteria.compatibility === "compatible" && build.warnings.length > 0) {
      return false;
    }
    if (criteria.compatibility === "warnings" && build.warnings.length === 0) {
      return false;
    }
    return true;
  });
}
