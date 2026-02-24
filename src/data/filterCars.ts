import { Car } from "../types/car";

interface FilterCriteria {
  brand?: string;
  countryCode?: string;
  type?: string;
}

export function filterCars(carsList: Car[], criteria: FilterCriteria) {
  const newCarsList = carsList.filter((item) => item.info.brand === )
}
