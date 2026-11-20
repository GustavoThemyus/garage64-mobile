import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type FilterToolbarButtonProps = {
  onPress: () => void;
  active: boolean;
};

// Botão de filtro do Android e da web (no iOS é o menu nativo). Precisa estar dentro de uma tela do Stack.
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
