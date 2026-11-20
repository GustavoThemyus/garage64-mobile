import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type FilterToolbarButtonProps = {
  onPress: () => void;
  // Ícone cheio quando o painel está aberto ou há filtro aplicado.
  active: boolean;
};

// Botão de filtro no header pro Android e pra web, que abre o painel. (No iOS o
// filtro é o balão nativo, ver NativeFilterMenu.) Usa headerRight, que funciona
// nas duas e aceita um ícone vetorial. Precisa estar dentro de uma tela do Stack.
export function FilterToolbarButton({ onPress, active }: FilterToolbarButtonProps) {
  const theme = useTheme();

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Filters"
            style={styles.button}
          >
            <Ionicons
              name={active ? "options" : "options-outline"}
              size={24}
              color={theme.accentText}
            />
          </Pressable>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
  },
});
