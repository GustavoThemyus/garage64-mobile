import { CarsRepository } from "../data/carsRepository";
import { Car } from "../types/car";
import { getSupabase } from "./client";

function isCar(value: unknown): value is Car {
  if (typeof value !== "object" || value === null) return false;
  const car = value as Record<string, unknown>;
  const info = car.info as Record<string, unknown> | undefined;
  return (
    typeof info?.id === "number" &&
    ["specs", "performance", "rules", "history"].every(
      (group) => typeof car[group] === "object" && car[group] !== null,
    )
  );
}

// Lê a tabela cars (cada linha guarda o próprio Car em `data`). Sem `initialCars` de propósito:
// o provider mostra "Loading" e só depois do banco. Se o banco falhar ou vier vazio, usa o catálogo local.
export function createSupabaseCarsRepository(
  fallback: CarsRepository,
): CarsRepository {
  return {
    async getCars() {
      try {
        const { data, error } = await getSupabase()
          .from("cars")
          .select("data")
          .order("id");
        if (error) throw error;
        const cars = (data ?? []).map((row) => row.data).filter(isCar);
        return cars.length > 0 ? cars : fallback.getCars();
      } catch {
        return fallback.getCars();
      }
    },
  };
}
