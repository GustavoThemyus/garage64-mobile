import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import { colors, ThemeColors, ThemeScheme } from "./colors";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "garage64:theme-preference";

export type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  scheme: ThemeScheme;
  colors: ThemeColors;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

// Faz os componentes nativos (tab bar, header, vidro) seguirem a preferência do app. Não existe na web.
function applyNativePreference(preference: ThemePreference) {
  try {
    Appearance.setColorScheme(
      preference === "system" ? "unspecified" : preference,
    );
  } catch {
  }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!alive) return;
        const next = isPreference(stored) ? stored : "system";
        applyNativePreference(next);
        setPreferenceState(next);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    applyNativePreference(next);
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  // o app nasceu escuro: tudo que não for "light" vira escuro
  const scheme: ThemeScheme =
    preference === "system"
      ? systemScheme === "light"
        ? "light"
        : "dark"
      : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference, scheme, colors: colors[scheme] }),
    [preference, setPreference, scheme],
  );

  // segura a árvore até ler a preferência salva; a splash cobre o intervalo
  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
