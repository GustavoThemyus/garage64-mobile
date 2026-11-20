import { Build } from "../types/build";
import { isBuild } from "../storage/parseBuilds";

// Forma da linha na tabela public.builds (supabase/migrations/0001_init.sql).
export type BuildRow = {
  id: string;
  user_id: string;
  car_id: number;
  name: string;
  config: Build["config"];
  computed: Build["computed"];
  warnings: Build["warnings"];
  created_at: string;
};

export function buildToRow(build: Build, userId: string): BuildRow {
  return {
    id: build.id,
    user_id: userId,
    car_id: build.carId,
    name: build.name,
    config: build.config,
    computed: build.computed,
    warnings: build.warnings,
    created_at: build.createdAt,
  };
}

// Linha malformada vira null em vez de quebrar a lista inteira.
export function rowToBuild(row: unknown): Build | null {
  if (typeof row !== "object" || row === null) return null;
  const data = row as Record<string, unknown>;
  const build = {
    id: data.id,
    carId: data.car_id,
    name: data.name,
    config: data.config,
    computed: data.computed,
    warnings: data.warnings,
    createdAt: data.created_at,
  };
  return isBuild(build) ? build : null;
}

export function newestFirst(builds: Build[]): Build[] {
  return [...builds].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}
