import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  ThemeProvider,
} from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";

import { CarsProvider } from "@/src/data/CarsProvider";
import { BuildsProvider } from "@/src/storage/BuildsProvider";
import { AppThemeProvider } from "@/src/theme/ThemeProvider";
import { useThemeController } from "@/src/theme/useTheme";

export {
  ErrorBoundary,
} from "expo-router";

// O botão de voltar do iOS mostra o título da tela anterior. Sem título, a rota raiz "(tabs)" aparecia com o nome do arquivo.
const TAB_TITLES: Record<string, string> = {
  "(catalog)": "Catalog",
  "(builds)": "Builds",
  "(assistant)": "Assistant",
  "(settings)": "Settings",
};

export const unstable_settings = {
  // base da pilha ao recarregar numa tela empilhada
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <CarsProvider>
        <BuildsProvider>
          <RootLayoutContent />
        </BuildsProvider>
      </CarsProvider>
    </AppThemeProvider>
  );
}

function RootLayoutContent() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { scheme, colors } = useThemeController();

  const navigationTheme = useMemo(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accentText,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [scheme, colors]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={({ route }) => ({
            headerShown: false,
            title: TAB_TITLES[getFocusedRouteNameFromRoute(route) ?? ""] ?? "Catalog",
          })}
        />
        <Stack.Screen name="carDetails" options={{ title: "Details" }} />
      </Stack>
    </ThemeProvider>
  );
}
