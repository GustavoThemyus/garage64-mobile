import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Car } from "../types/car";
import { CarsRepository, localCarsRepository } from "./carsRepository";

type CarsContextValue = {
  cars: Car[];
  // false enquanto o catálogo ainda está chegando.
  ready: boolean;
  // Mensagem quando a carga falhou, senão null.
  error: string | null;
  getCar: (id: number) => Car | undefined;
  reload: () => void;
};

const CarsContext = createContext<CarsContextValue | null>(null);

type CarsProviderProps = {
  children: ReactNode;
  repository?: CarsRepository;
};

// Fonte única do catálogo pro app inteiro. As telas leem daqui com useCars()
// em vez de importar o mock, e assim o catálogo pode vir de qualquer lugar.
export function CarsProvider({
  children,
  repository = localCarsRepository,
}: CarsProviderProps) {
  const [cars, setCars] = useState<Car[]>(repository.initialCars ?? []);
  const [ready, setReady] = useState(repository.initialCars !== undefined);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Com catálogo inicial (mock) não há o que esperar na primeira carga.
    if (attempt === 0 && repository.initialCars) return;

    let alive = true;
    setError(null);
    repository
      .getCars()
      .then((loaded) => {
        if (!alive) return;
        setCars(loaded);
        setReady(true);
      })
      .catch(() => {
        if (alive) setError("Could not load the catalog.");
      });
    return () => {
      alive = false;
    };
  }, [repository, attempt]);

  const byId = useMemo(
    () => new Map(cars.map((car) => [car.info.id, car])),
    [cars],
  );
  const getCar = useCallback((id: number) => byId.get(id), [byId]);
  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  const value = useMemo<CarsContextValue>(
    () => ({ cars, ready, error, getCar, reload }),
    [cars, ready, error, getCar, reload],
  );

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

export function useCars(): CarsContextValue {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error("useCars must be used inside CarsProvider");
  }
  return context;
}
