import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Build, BuildDraft } from "../types/build";
import { buildFromDraft } from "./buildFromDraft";
import { BuildsRepository } from "./buildsRepository";
import { localBuildsRepository } from "./localBuildsRepository";

type BuildsContextValue = {
  builds: Build[];
  ready: boolean;
  getBuild: (id: string) => Build | undefined;
  saveBuild: (draft: BuildDraft) => Build;
  renameBuild: (id: string, name: string) => void;
  deleteBuild: (id: string) => void;
};

const BuildsContext = createContext<BuildsContextValue | null>(null);

type BuildsProviderProps = {
  children: ReactNode;
  repository?: BuildsRepository;
};

export function BuildsProvider({
  children,
  repository = localBuildsRepository,
}: BuildsProviderProps) {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [ready, setReady] = useState(false);
  // Última lista conhecida, lida de forma síncrona pelas ações. Evita perder uma
  // alteração quando duas acontecem antes do React re-renderizar.
  const latest = useRef<Build[]>([]);

  const adopt = useCallback((next: Build[]) => {
    latest.current = next;
    setBuilds(next);
  }, []);

  useEffect(() => {
    let alive = true;
    repository
      .list()
      .then((stored) => {
        if (alive) adopt(stored);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [repository, adopt]);

  // A tela muda na hora (otimista) e o repositório grava em seguida. Se a gravação
  // falhar, a lista é relida do repositório pra tela não mostrar algo que não existe.
  const persist = useCallback(
    (operation: Promise<void>) => {
      operation.catch(() => {
        repository
          .list()
          .then(adopt)
          .catch(() => {});
      });
    },
    [repository, adopt],
  );

  const getBuild = useCallback(
    (id: string) => latest.current.find((build) => build.id === id),
    [],
  );

  const saveBuild = useCallback(
    (draft: BuildDraft): Build => {
      const existing = draft.id
        ? latest.current.find((build) => build.id === draft.id)
        : undefined;
      const build = buildFromDraft(draft, existing);

      adopt(
        existing
          ? latest.current.map((item) => (item.id === build.id ? build : item))
          : [build, ...latest.current],
      );
      persist(repository.save(build));
      return build;
    },
    [adopt, persist, repository],
  );

  const renameBuild = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      const target = latest.current.find((build) => build.id === id);
      if (!trimmed || !target) return;

      const renamed = { ...target, name: trimmed };
      adopt(latest.current.map((build) => (build.id === id ? renamed : build)));
      persist(repository.save(renamed));
    },
    [adopt, persist, repository],
  );

  const deleteBuild = useCallback(
    (id: string) => {
      adopt(latest.current.filter((build) => build.id !== id));
      persist(repository.remove(id));
    },
    [adopt, persist, repository],
  );

  const value = useMemo<BuildsContextValue>(
    () => ({ builds, ready, getBuild, saveBuild, renameBuild, deleteBuild }),
    [builds, ready, getBuild, saveBuild, renameBuild, deleteBuild],
  );

  return (
    <BuildsContext.Provider value={value}>{children}</BuildsContext.Provider>
  );
}

export function useBuilds(): BuildsContextValue {
  const context = useContext(BuildsContext);
  if (!context) {
    throw new Error("useBuilds must be used inside BuildsProvider");
  }
  return context;
}
