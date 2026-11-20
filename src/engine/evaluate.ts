import { BuildConfig, BuildPerformance, BuildWarning } from "../types/build";
import { Car } from "../types/car";
import { calculateBuild } from "./calculate";
import { validateBuild } from "./validate";

export type EvaluatedBuild = {
  performance: BuildPerformance;
  weightKg: number;
  warnings: BuildWarning[];
};

// Tudo que o configurador mostra e salva sai daqui: resultado calculado + avisos.
export function evaluateBuild(car: Car, config: BuildConfig): EvaluatedBuild {
  const { performance, weightKg } = calculateBuild(car, config);
  return { performance, weightKg, warnings: validateBuild(car, config) };
}
