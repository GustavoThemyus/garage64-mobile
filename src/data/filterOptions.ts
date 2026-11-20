import { Car } from "../types/car";
import { countryName } from "./countries";

export type FilterOption = { value: string; label: string };

export type FilterOptions = {
  brands: FilterOption[];
  countries: FilterOption[];
  types: FilterOption[];
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

// As opções saem do catálogo: valor é o que o filtro compara ("JP"), label é o que o usuário lê.
export function getFilterOptions(cars: Car[]): FilterOptions {
  return {
    brands: unique(cars.map((car) => car.info.brand)).map((value) => ({
      value,
      label: value,
    })),
    countries: unique(cars.map((car) => car.info.countryCode)).map((value) => ({
      value,
      label: countryName(value),
    })),
    types: unique(cars.map((car) => car.specs.type)).map((value) => ({
      value,
      label: value,
    })),
  };
}
