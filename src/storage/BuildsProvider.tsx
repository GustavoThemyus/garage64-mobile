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

import {
  Build,
  BuildConfig,
  BuildPerformance,
  BuildWarning,
} from "../types/build";
import { loadBuilds, saveBuilds } from "./buildsStorage";

export type BuildDraft = {
  // Com id, atualiza a build existente. Sem id, cria uma nova.
  id?: string;
  carId: number;
  name: string;
  config: BuildConfig;
  computed: BuildPerformance;
  warnings: BuildWarning[];
};

type BuildsContextValue = {
  builds: Build[];
  ready: boolean;
  getBuild: (id: string) => Build | undefined;
  saveBuild: (draft: BuildDraft) => Build;
  renameBuild: (id: string, name: string) => void;
  deleteBuild: (id: string) => void;
};

const BuildsContext = createContext<BuildsContextValue | null>(null);

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function BuildsProvider({ children }: { children: ReactNode }) {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [ready, setReady] = useState(false);
  // Última lista conhecida, lida de forma síncrona pelas ações. Evita perder uma
  // alteração quando duas acontecem antes do React re-renderizar.
  const latest = useRef<Build[]>([]);

  useEffect(() => {
    let alive = true;
    loadBuilds()
      .then((stored) => {
        if (!alive) return;
        latest.current = stored;
        setBuilds(stored);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const commit = useCallback((next: Build[]) => {
    latest.current = next;
    setBuilds(next);
    saveBuilds(next).catch(() => {});
  }, []);

  const getBuild = useCallback(
    (id: string) => latest.current.find((build) => build.id === id),
    [],
  );

  const saveBuild = useCallback(
    (draft: BuildDraft): Build => {
      const existing = draft.id
        ? latest.current.find((build) => build.id === draft.id)
        : undefined;

      const build: Build = {
        id: existing?.id ?? createId(),
        carId: draft.carId,
        name: draft.name.trim(),
        config: draft.config,
        computed: draft.computed,
        warnings: draft.warnings,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };

      commit(
        existing
          ? latest.current.map((item) => (item.id === build.id ? build : item))
          : [build, ...latest.current],
      );
      return build;
    },
    [commit],
  );

  const renameBuild = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      commit(
        latest.current.map((build) =>
          build.id === id ? { ...build, name: trimmed } : build,
        ),
      );
    },
    [commit],
  );

  const deleteBuild = useCallback(
    (id: string) => {
      commit(latest.current.filter((build) => build.id !== id));
    },
    [commit],
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
