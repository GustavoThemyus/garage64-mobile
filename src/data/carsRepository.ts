import { Car } from "../types/car";
import { carsMoch } from "./carsMoch";

// De onde o catálogo vem. Hoje é o mock local. Na fase 2 (spec) o catálogo
// migra pro banco: basta escrever outra implementação desta interface, por
// exemplo uma que lê a tabela `cars` do Supabase, e passá-la ao CarsProvider.
// Nenhuma tela precisa mudar.
export interface CarsRepository {
  // Quando existe, o catálogo já nasce pronto (sem tela de carregando).
  initialCars?: Car[];
  getCars(): Promise<Car[]>;
}

export const localCarsRepository: CarsRepository = {
  initialCars: carsMoch,
  getCars: async () => carsMoch,
};
