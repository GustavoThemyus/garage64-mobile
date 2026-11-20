import { Build, BuildDraft } from "../types/build";

export function createBuildId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// Com uma build existente (edição) mantém o id e a data de criação. Pura, pra poder ser testada.
export function buildFromDraft(
  draft: BuildDraft,
  existing?: Build,
  now: Date = new Date(),
  makeId: () => string = createBuildId,
): Build {
  return {
    id: existing?.id ?? makeId(),
    carId: draft.carId,
    name: draft.name.trim(),
    config: draft.config,
    computed: draft.computed,
    warnings: draft.warnings,
    createdAt: existing?.createdAt ?? now.toISOString(),
  };
}
