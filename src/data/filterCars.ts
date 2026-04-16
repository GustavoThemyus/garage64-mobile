import { Car } from "../types/car";
interface FilterCriteria {
  selectedFilters: string[];
}

export function filterCars(carsList: Car[], criteria: FilterCriteria) {
  if (criteria.selectedFilters.length === 0) {
    return carsList;
  }

  return carsList.filter((item) => {
    const brand = item.info.brand;
    const country = item.info.countryCode;
    const type = item.specs.type;

    const hasBrand = criteria.selectedFilters.includes(brand);
    const hasCountry = criteria.selectedFilters.includes(country);
    const hasType = criteria.selectedFilters.includes(type);

    return hasBrand || hasCountry || hasType;
  });
}
