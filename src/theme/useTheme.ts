import { useColorScheme } from "react-native";
import { colors } from "./colors";

export function useTheme() {
  const scheme = useColorScheme();
  return colors[scheme ?? "dark"];
}
