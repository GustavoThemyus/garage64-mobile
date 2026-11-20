import type { NativeStackNavigationOptions } from "expo-router/native-stack";

import { useTheme } from "@/src/theme/useTheme";

// Título na cor de texto e não no amarelo, que sumia sobre as fotos claras. O contraste sob o header é do sistema
// (borda de rolagem do iOS 26) e só funciona se a lista da tela for o primeiro filho dela, o que também faz o título grande colapsar.
export function useTabStackOptions(): NativeStackNavigationOptions {
  const theme = useTheme();

  return {
    headerLargeTitle: true,
    headerTintColor: theme.accentText,
    headerTitleStyle: { color: theme.textPrimary },
    headerLargeTitleStyle: { color: theme.textPrimary },
    contentStyle: { backgroundColor: theme.background },
  };
}
