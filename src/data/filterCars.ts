import { Car } from "../types/car";
export interface FilterCriteria {
  selectedBrand: string[];
  selectedType: string[];
  selectedCountry: string[];
}

export function filterCars(carsList: Car[], criteria: FilterCriteria) {
  if (
    criteria.selectedBrand.length === 0 &&
    criteria.selectedType.length === 0 &&
    criteria.selectedCountry.length === 0
  ) {
    return carsList;
  }

  return carsList.filter((item) => {
    const brand = item.info.brand;
    const type = item.specs.type;
    const country = item.info.countryCode;

    const hasBrand =
      criteria.selectedBrand.includes(brand) ||
      criteria.selectedBrand.length === 0;
    const hasType =
      criteria.selectedType.includes(type) ||
      criteria.selectedType.length === 0;
    const hasCountry =
      criteria.selectedCountry.includes(country) ||
      criteria.selectedCountry.length === 0;

    return hasBrand && hasType && hasCountry;
  });
}
