import { FACTORY_ID } from "../data/partsCatalog";
import { BuildConfig } from "../types/build";
import { Car } from "../types/car";
import { normalizeAspiration } from "./aspiration";

// "4x4 (AWD)" e "4x4 (AWD - Symmetrical AWD)" são integral, "4x2 (RWD)" não.
export function isFactoryAwd(car: Car): boolean {
  return /awd|4x4/i.test(car.specs.traction);
}

export function getFactoryConfig(car: Car): BuildConfig {
  return {
    displacement: car.specs.displacement,
    valves: car.specs.valves,
    aspiration: normalizeAspiration(car.specs.aspiration) ?? "naturally-aspirated",
    transmission: FACTORY_ID,
    wheels: FACTORY_ID,
    steering: FACTORY_ID,
    brakes: FACTORY_ID,
    awd: isFactoryAwd(car),
    nos: false,
  };
}

export type SliderRange = {
  min: number;
  max: number;
  step: number;
};

export type ConfigRanges = {
  displacement: SliderRange;
  // null no motor rotativo, que não tem válvulas
  valves: SliderRange | null;
};

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function getConfigRanges(car: Car): ConfigRanges {
  const { displacement, valves } = car.specs;

  return {
    displacement: {
      min: roundTo(Math.max(1, displacement - 0.6), 0.1),
      max: roundTo(Math.min(8, displacement + 1.5), 0.1),
      step: 0.1,
    },
    valves:
      valves > 0
        ? { min: Math.max(4, valves - 8), max: valves + 16, step: 4 }
        : null,
  };
}
