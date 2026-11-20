import { Car } from "./car";

export type AspirationId =
  | "naturally-aspirated"
  | "supercharged"
  | "single-turbo"
  | "twin-turbo";

// Campos categóricos do configurador. O valor é o id de uma opção do catálogo de peças, ou "factory".
export type PartField = "transmission" | "wheels" | "steering" | "brakes";

export type BuildConfig = {
  displacement: number;
  valves: number;
  aspiration: AspirationId;
  transmission: string;
  wheels: string;
  steering: string;
  brakes: string;
  awd: boolean;
  nos: boolean;
};

export type BuildWarningCode =
  | "awd-not-supported"
  | "nos-not-supported"
  | "aspiration-not-allowed"
  | "traction-change-not-allowed"
  | "hp-over-limit";

export type BuildWarning = {
  code: BuildWarningCode;
  message: string;
};

// Mesma forma de Car["performance"].
export type BuildPerformance = Car["performance"];

export type CalculatedBuild = {
  performance: BuildPerformance;
  weightKg: number;
};

export type Build = {
  id: string;
  // Car.info.id; nunca uma cópia do carro
  carId: number;
  name: string;
  config: BuildConfig;
  computed: BuildPerformance;
  warnings: BuildWarning[];
  createdAt: string;
};

// Com id atualiza uma build existente; sem id cria uma nova.
export type BuildDraft = {
  id?: string;
  carId: number;
  name: string;
  config: BuildConfig;
  computed: BuildPerformance;
  warnings: BuildWarning[];
};
