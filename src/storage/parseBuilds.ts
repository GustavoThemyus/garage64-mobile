import { ASPIRATION_IDS } from "../data/partsCatalog";
import { Build } from "../types/build";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumberPair(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === "number")
  );
}

function isConfig(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.displacement === "number" &&
    typeof value.valves === "number" &&
    typeof value.aspiration === "string" &&
    (ASPIRATION_IDS as string[]).includes(value.aspiration) &&
    typeof value.transmission === "string" &&
    typeof value.wheels === "string" &&
    typeof value.steering === "string" &&
    typeof value.brakes === "string" &&
    typeof value.awd === "boolean" &&
    typeof value.nos === "boolean"
  );
}

function isPerformance(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.hp === "number" &&
    isNumberPair(value.torque) &&
    isNumberPair(value.topSpeed) &&
    typeof value.acceleration === "number" &&
    typeof value.consumption === "number"
  );
}

function isWarning(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.message === "string"
  );
}

export function isBuild(value: unknown): value is Build {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.carId === "number" &&
    typeof value.name === "string" &&
    typeof value.createdAt === "string" &&
    isConfig(value.config) &&
    isPerformance(value.computed) &&
    Array.isArray(value.warnings) &&
    value.warnings.every(isWarning)
  );
}

// Dado corrompido vira lista vazia; itens inválidos são descartados.
export function parseBuilds(raw: string | null): Build[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isBuild) : [];
  } catch {
    return [];
  }
}
