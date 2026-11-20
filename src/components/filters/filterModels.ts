import { FilterCriteria, hasActiveFilters } from "../../data/filterCars";
import { getFilterOptions } from "../../data/filterOptions";
import {
  BuildFilterCriteria,
  CompatibilityFilter,
  HP_RANGES,
  hasActiveBuildFilters,
  HpRangeId,
} from "../../engine/filterBuilds";
import { Build } from "../../types/build";
import { Car } from "../../types/car";
import { FilterMenuModel } from "./types";

function plural(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function toggled<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

type CarFilterModelInput = {
  cars: Car[];
  filters: FilterCriteria;
  onToggle: (category: keyof FilterCriteria, value: string) => void;
  onClear: () => void;
  resultCount: number;
};

export function buildCarFilterModel({
  cars,
  filters,
  onToggle,
  onClear,
  resultCount,
}: CarFilterModelInput): FilterMenuModel {
  const options = getFilterOptions(cars);
  const active = hasActiveFilters(filters);

  return {
    resultLabel: plural(resultCount, "car"),
    active,
    canClear: active,
    onClear,
    sections: [
      {
        kind: "multi",
        id: "brand",
        title: "Brand",
        options: options.brands,
        selected: filters.selectedBrand,
        onToggle: (value) => onToggle("selectedBrand", value),
      },
      {
        kind: "multi",
        id: "country",
        title: "Country",
        options: options.countries,
        selected: filters.selectedCountry,
        onToggle: (value) => onToggle("selectedCountry", value),
      },
      {
        kind: "multi",
        id: "type",
        title: "Type",
        options: options.types,
        selected: filters.selectedType,
        onToggle: (value) => onToggle("selectedType", value),
      },
    ],
  };
}

type BuildFilterModelInput = {
  cars: Car[];
  builds: Build[];
  criteria: BuildFilterCriteria;
  onChange: (criteria: BuildFilterCriteria) => void;
  onClear: () => void;
  resultCount: number;
};

const COMPATIBILITY_OPTIONS: { value: CompatibilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "compatible", label: "Compatible" },
  { value: "warnings", label: "With warnings" },
];

// As opções de carro e marca são só as dos carros que têm build salva.
export function buildBuildFilterModel({
  cars,
  builds,
  criteria,
  onChange,
  onClear,
  resultCount,
}: BuildFilterModelInput): FilterMenuModel {
  const usedIds = new Set(builds.map((build) => build.carId));
  const usedCars = cars.filter((car) => usedIds.has(car.info.id));
  const brands = Array.from(new Set(usedCars.map((car) => car.info.brand)));
  const active = hasActiveBuildFilters(criteria);

  return {
    resultLabel: plural(resultCount, "build"),
    active,
    canClear: active,
    onClear,
    sections: [
      {
        kind: "multi",
        id: "base-car",
        title: "Base car",
        options: usedCars.map((car) => ({
          value: String(car.info.id),
          label: car.info.model,
        })),
        selected: criteria.carIds.map(String),
        onToggle: (value) =>
          onChange({ ...criteria, carIds: toggled(criteria.carIds, Number(value)) }),
      },
      {
        kind: "multi",
        id: "brand",
        title: "Brand",
        options: brands.map((brand) => ({ value: brand, label: brand })),
        selected: criteria.brands,
        onToggle: (value) =>
          onChange({ ...criteria, brands: toggled(criteria.brands, value) }),
      },
      {
        kind: "single",
        id: "power",
        title: "Power",
        options: HP_RANGES.map(({ id, label }) => ({ value: id, label })),
        value: criteria.hpRange,
        onChange: (value) =>
          onChange({ ...criteria, hpRange: value as HpRangeId }),
      },
      {
        kind: "single",
        id: "compatibility",
        title: "Compatibility",
        options: COMPATIBILITY_OPTIONS,
        value: criteria.compatibility,
        onChange: (value) =>
          onChange({ ...criteria, compatibility: value as CompatibilityFilter }),
      },
    ],
  };
}
