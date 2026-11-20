import { useContext } from "react";
import { useColorScheme } from "react-native";
import { colors, ThemeColors, ThemeScheme } from "./colors";
import { ThemeContext, ThemeContextValue } from "./ThemeProvider";

// Fora do AppThemeProvider cai no esquema do sistema, sem poder trocar.
export function useThemeController(): ThemeContextValue {
  const context = useContext(ThemeContext);
  const systemScheme = useColorScheme();

  if (context) return context;

  const scheme: ThemeScheme = systemScheme === "light" ? "light" : "dark";
  return {
    preference: "system",
    setPreference: () => {},
    scheme,
    colors: colors[scheme],
  };
}

export function useTheme(): ThemeColors {
  return useThemeController().colors;
}
