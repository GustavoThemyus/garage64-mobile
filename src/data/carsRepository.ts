import { Car } from "../types/car";
import { carsMoch } from "./carsMoch";

// Hoje é o mock local; na fase 2 o catálogo vem do banco com outra implementação desta interface.
export interface CarsRepository {
  // quando existe, o catálogo nasce pronto
  initialCars?: Car[];
  getCars(): Promise<Car[]>;
}

export const localCarsRepository: CarsRepository = {
  initialCars: carsMoch,
  getCars: async () => carsMoch,
};
