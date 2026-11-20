import { Car } from "../types/car";
import { dictionary } from "../data/dictionary";

export type CompareMetricKey =
  | "hp"
  | "torque"
  | "topSpeed"
  | "acceleration"
  | "consumption"
  | "weight";

// Em hp, maior é melhor. Em aceleração (segundos até 100 km/h) e peso, menor é melhor.
export type BetterWhen = "higher" | "lower";

export type CompareMetric = {
  key: CompareMetricKey;
  label: string;
  unit: string;
  betterWhen: BetterWhen;
  decimals: number;
  read: (car: Car) => number;
};

export const COMPARE_METRICS: CompareMetric[] = [
  {
    key: "hp",
    label: dictionary.performance.hp,
    unit: "HP",
    betterWhen: "higher",
    decimals: 0,
    read: (car) => car.performance.hp,
  },
  {
    key: "torque",
    label: dictionary.performance.torque,
    unit: "Nm",
    betterWhen: "higher",
    decimals: 0,
    read: (car) => car.performance.torque[0],
  },
  {
    key: "topSpeed",
    label: dictionary.performance.topSpeed,
    unit: "km/h",
    betterWhen: "higher",
    decimals: 0,
    read: (car) => car.performance.topSpeed[0],
  },
  {
    key: "acceleration",
    label: dictionary.performance.acceleration,
    unit: "s",
    betterWhen: "lower",
    decimals: 1,
    read: (car) => car.performance.acceleration,
  },
  {
    key: "consumption",
    label: dictionary.performance.consumption,
    unit: "km/L",
    betterWhen: "higher",
    decimals: 1,
    read: (car) => car.performance.consumption,
  },
  {
    key: "weight",
    label: dictionary.specs.weight,
    unit: "kg",
    betterWhen: "lower",
    decimals: 0,
    read: (car) => car.specs.weight[0],
  },
];

export type CompareSide = {
  value: number;
  // 0 a 1, onde 1 é o melhor dos dois. É o comprimento da barra verde.
  score: number;
};

export type MetricComparison = {
  metric: CompareMetric;
  a: CompareSide;
  b: CompareSide;
  winner: "a" | "b" | "tie";
  // Diferença entre os dois, em % do maior valor.
  gapPercent: number;
};

function scoreOf(value: number, a: number, b: number, betterWhen: BetterWhen) {
  if (betterWhen === "higher") {
    const best = Math.max(a, b);
    return best === 0 ? 1 : value / best;
  }
  // Menor é melhor: o melhor é o menor valor, e quanto maior o valor, pior o score.
  const best = Math.min(a, b);
  return value === 0 ? 1 : best / value;
}

export function compareMetric(
  metric: CompareMetric,
  valueA: number,
  valueB: number,
): MetricComparison {
  const scoreA = scoreOf(valueA, valueA, valueB, metric.betterWhen);
  const scoreB = scoreOf(valueB, valueA, valueB, metric.betterWhen);

  const winner =
    scoreA === scoreB ? "tie" : scoreA > scoreB ? "a" : "b";
  const larger = Math.max(Math.abs(valueA), Math.abs(valueB));
  const gapPercent =
    larger === 0 ? 0 : Math.round((Math.abs(valueA - valueB) / larger) * 100);

  return {
    metric,
    a: { value: valueA, score: scoreA },
    b: { value: valueB, score: scoreB },
    winner,
    gapPercent,
  };
}

export function compareCars(a: Car, b: Car): MetricComparison[] {
  return COMPARE_METRICS.map((metric) =>
    compareMetric(metric, metric.read(a), metric.read(b)),
  );
}

export function formatMetricValue(metric: CompareMetric, value: number) {
  return `${value.toFixed(metric.decimals)} ${metric.unit}`;
}
