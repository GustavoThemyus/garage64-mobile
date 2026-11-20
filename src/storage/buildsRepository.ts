import { Build } from "../types/build";

// Onde as builds ficam guardadas. Hoje é o AsyncStorage do aparelho
// (localBuildsRepository.ts). Na fase 2 (spec) as builds vão pro Supabase: basta
// outra implementação desta interface, com list = select, save = upsert e
// remove = delete. O BuildsProvider e as telas não mudam. As operações são por
// item porque é assim que um banco opera.
export interface BuildsRepository {
  list(): Promise<Build[]>;
  // Insere ou atualiza, pelo id.
  save(build: Build): Promise<void>;
  remove(id: string): Promise<void>;
}

// Implementação em memória, com o mesmo contrato. Serve pra testar a lógica sem
// o AsyncStorage (que só existe dentro do app).
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
