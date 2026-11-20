import { Build, BuildDraft } from "../types/build";

export function createBuildId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// Transforma o rascunho do configurador numa Build. Com uma build existente
// (edição) mantém o id e a data de criação. Função pura, de propósito: é a regra
// que o backend também vai precisar aplicar, e assim dá pra testá-la sem o app.
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
