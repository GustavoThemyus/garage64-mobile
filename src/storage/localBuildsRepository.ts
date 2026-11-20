import AsyncStorage from "@react-native-async-storage/async-storage";

import { Build } from "../types/build";
import { BuildsRepository } from "./buildsRepository";
import { parseBuilds } from "./parseBuilds";

// Chave versionada: deixa mudar o formato no futuro sem ler lixo antigo.
const STORAGE_KEY = "garage64:builds:v1";

export function createLocalBuildsRepository(): BuildsRepository {
  // O AsyncStorage só guarda a lista inteira, então salvar é ler, mudar e gravar.
  // Duas operações rápidas em paralelo se atropelariam, então vão numa fila.
  let queue: Promise<unknown> = Promise.resolve();
  const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
    const next = queue.then(task, task);
    queue = next.catch(() => {});
    return next;
  };

  const read = async () =>
    parseBuilds(await AsyncStorage.getItem(STORAGE_KEY));
  const write = (builds: Build[]) =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(builds));

  return {
    list: () => enqueue(read),
    save: (build) =>
      enqueue(async () => {
        const builds = await read();
        const exists = builds.some((item) => item.id === build.id);
        await write(
          exists
            ? builds.map((item) => (item.id === build.id ? build : item))
            : [build, ...builds],
        );
      }),
    remove: (id) =>
      enqueue(async () => {
        const builds = await read();
        await write(builds.filter((item) => item.id !== id));
      }),
  };
}

export const localBuildsRepository = createLocalBuildsRepository();
