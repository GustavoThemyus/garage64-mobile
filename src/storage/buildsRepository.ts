import { Build } from "../types/build";

// Hoje é o AsyncStorage; na fase 2 vira o Supabase (list = select, save = upsert, remove = delete) sem mudar telas.
// As operações são por item porque é assim que um banco opera.
export interface BuildsRepository {
  list(): Promise<Build[]>;
  // insere ou atualiza, pelo id
  save(build: Build): Promise<void>;
  remove(id: string): Promise<void>;
}

// Mesmo contrato, em memória: serve pra testar sem o AsyncStorage.
export function createMemoryBuildsRepository(
  initial: Build[] = [],
): BuildsRepository {
  let builds = [...initial];
  return {
    list: async () => [...builds],
    save: async (build) => {
      builds = builds.some((item) => item.id === build.id)
        ? builds.map((item) => (item.id === build.id ? build : item))
        : [build, ...builds];
    },
    remove: async (id) => {
      builds = builds.filter((item) => item.id !== id);
    },
  };
}
