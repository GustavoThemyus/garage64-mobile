import { Car } from "../types/car";
import { dictionary } from "./dictionary";

type SpecValue = string | number | number[];

export type DetailRow = { key: string; label: string; value: string };

export type PerformanceStat = {
  key: string;
  label: string;
  value: string;
  unit: string;
  detail?: string;
};

// "1999" vira "1990s". A década não é campo do mock, deriva do ano.
export function decadeOf(year: number): string {
  return `${Math.floor(year / 10) * 10}s`;
}

// Weight guarda [kg, lb]: a mesma massa em duas unidades.
function formatSpecValue(field: string, value: SpecValue): string {
  if (field === "weight" && Array.isArray(value)) {
    return `${value[0]} kg / ${value[1]} lb`;
  }
  if (field === "displacement" && typeof value === "number") {
    return `${value.toFixed(1)} L`;
  }
  if (field === "valves" && typeof value === "number") {
    return value === 0 ? "None (rotary)" : String(value);
  }
  return String(value);
}

// As 13 specs viram linhas rótulo/valor. O rótulo vem do dicionário, nunca do
// nome da chave, que é identificador do código e não texto pro usuário.
export function getSpecRows(car: Car): DetailRow[] {
  return Object.entries(car.specs).map(([field, value]) => ({
    key: field,
    label: dictionary.specs[field as keyof typeof dictionary.specs] ?? field,
    value: formatSpecValue(field, value),
  }));
}

export function getIdentificationRows(car: Car): DetailRow[] {
  const { info } = car;
  return [
    { key: "brand", label: dictionary.info.brand, value: info.brand },
    { key: "model", label: dictionary.info.model, value: info.model },
    { key: "year", label: dictionary.info.year, value: String(info.year) },
    { key: "decade", label: dictionary.info.decade, value: decadeOf(info.year) },
    { key: "color", label: dictionary.info.color, value: info.color },
    {
      key: "generation",
      label: dictionary.info.generation,
      value: info.generation,
    },
  ];
}

// Torque guarda [Nm, rpm]: duas grandezas diferentes (o valor e a rotação onde
// ele acontece). Já topSpeed guarda [km/h, mph]: a mesma velocidade em duas unidades.
export function getPerformanceStats(
  performance: Car["performance"],
): PerformanceStat[] {
  const { hp, torque, topSpeed, acceleration, consumption } = performance;
  const label = dictionary.performance;

  return [
    { key: "hp", label: label.hp, value: String(hp), unit: "HP" },
    {
      key: "torque",
      label: label.torque,
      value: String(torque[0]),
      unit: "Nm",
      detail: `at ${torque[1]} rpm`,
    },
    {
      key: "topSpeed",
      label: label.topSpeed,
      value: String(topSpeed[0]),
      unit: "km/h",
      detail: `${topSpeed[1]} mph`,
    },
    {
      key: "acceleration",
      label: label.acceleration,
      value: acceleration.toFixed(1),
      unit: "s",
      detail: "0 to 100 km/h",
    },
    {
      key: "consumption",
      label: label.consumption,
      value: String(consumption),
      unit: "km/L",
    },
  ];
}
