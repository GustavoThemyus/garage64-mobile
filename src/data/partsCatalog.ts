import { AspirationId, PartField } from "../types/build";
import { Car } from "../types/car";

// O mock guarda só UM valor por carro em cada campo (o de fábrica). As opções
// do configurador vêm daqui: toda lista começa com "Factory" (o texto do próprio
// carro) e segue com upgrades que valem pra qualquer carro.

export type PartOption = {
  id: string;
  label: string;
  // Variação de peso em kg em relação à peça de fábrica.
  weightDelta: number;
  // Multiplicadores sobre o tempo de 0 a 100 e sobre o consumo (1 = sem efeito).
  accelerationFactor: number;
  consumptionFactor: number;
};

export const FACTORY_ID = "factory";

type Upgrade = Omit<PartOption, "accelerationFactor" | "consumptionFactor"> &
  Partial<Pick<PartOption, "accelerationFactor" | "consumptionFactor">>;

const UPGRADES: Record<PartField, Upgrade[]> = {
  transmission: [
    {
      id: "close-ratio",
      label: "Close-ratio manual",
      weightDelta: 0,
      accelerationFactor: 0.97,
      consumptionFactor: 1.03,
    },
    {
      id: "sequential",
      label: "Sequential gearbox",
      weightDelta: -8,
      accelerationFactor: 0.94,
      consumptionFactor: 1.06,
    },
    {
      id: "dual-clutch",
      label: "Dual-clutch (DCT)",
      weightDelta: 25,
      accelerationFactor: 0.95,
      consumptionFactor: 0.98,
    },
  ],
  wheels: [
    { id: "forged", label: "Lightweight forged alloys", weightDelta: -16 },
    { id: "magnesium", label: "Magnesium racing wheels", weightDelta: -24 },
  ],
  steering: [
    {
      id: "quick-rack",
      label: "Quick-ratio rack",
      weightDelta: 2,
    },
    {
      id: "electric-assist",
      label: "Electric power assist",
      weightDelta: -5,
      consumptionFactor: 0.99,
    },
  ],
  brakes: [
    { id: "big-brake-kit", label: "Big brake kit", weightDelta: 6 },
    {
      id: "carbon-ceramic",
      label: "Carbon-ceramic discs",
      weightDelta: -10,
    },
  ],
};

function toOption(upgrade: Upgrade): PartOption {
  return {
    accelerationFactor: 1,
    consumptionFactor: 1,
    ...upgrade,
  };
}

export function getPartOptions(car: Car, field: PartField): PartOption[] {
  const factory: PartOption = {
    id: FACTORY_ID,
    label: car.specs[field],
    weightDelta: 0,
    accelerationFactor: 1,
    consumptionFactor: 1,
  };
  return [factory, ...UPGRADES[field].map(toOption)];
}

export function findPartOption(
  car: Car,
  field: PartField,
  id: string,
): PartOption {
  const options = getPartOptions(car, field);
  return options.find((option) => option.id === id) ?? options[0];
}

export type AspirationSpec = {
  label: string;
  // Multiplicador de potência sobre um motor aspirado.
  power: number;
  // Peso extra em kg do equipamento (turbo, compressor, intercooler).
  weight: number;
  // Multiplicador de consumo (maior = bebe mais).
  consumption: number;
};

export const ASPIRATIONS: Record<AspirationId, AspirationSpec> = {
  "naturally-aspirated": {
    label: "Naturally aspirated",
    power: 1,
    weight: 0,
    consumption: 1,
  },
  supercharged: {
    label: "Supercharged",
    power: 1.28,
    weight: 30,
    consumption: 1.12,
  },
  "single-turbo": {
    label: "Single turbo",
    power: 1.4,
    weight: 35,
    consumption: 1.1,
  },
  "twin-turbo": {
    label: "Twin turbo",
    power: 1.5,
    weight: 55,
    consumption: 1.18,
  },
};

export const ASPIRATION_IDS = Object.keys(ASPIRATIONS) as AspirationId[];
