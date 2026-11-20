import type { NativeStackNavigationOptions } from "expo-router/native-stack";

import { useTheme } from "@/src/theme/useTheme";

// Opções comuns do Stack que cada tab carrega dentro dela (é o Stack que dá o
// header à tab nativa): título grande no estilo iOS e cores do tema.
export function useTabStackOptions(): NativeStackNavigationOptions {
  const theme = useTheme();

  return {
    headerLargeTitle: true,
    headerTintColor: theme.accentText,
    contentStyle: { backgroundColor: theme.background },
  };
}
