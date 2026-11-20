import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Platform, Pressable, StyleSheet } from "react-native";

import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type FilterToolbarButtonProps = {
  onPress: () => void;
  // Ícone cheio quando o painel está aberto ou há filtro aplicado.
  active: boolean;
};

// Botão de filtro do header. No iOS e no Android é um Stack.Toolbar.Button
// (ganha o vidro do iOS 26). A web não tem toolbar, então vira headerRight.
// Precisa ser renderizado dentro de uma tela do Stack.
export function FilterToolbarButton({ onPress, active }: FilterToolbarButtonProps) {
  const theme = useTheme();

  if (Platform.OS === "web") {
    return (
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel="Filters"
              style={styles.webButton}
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

  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button
        icon={
          active
            ? "line.3.horizontal.decrease.circle.fill"
            : "line.3.horizontal.decrease.circle"
        }
        accessibilityLabel="Filters"
        onPress={onPress}
      />
    </Stack.Toolbar>
  );
}

const styles = StyleSheet.create({
  webButton: {
    paddingHorizontal: spacing.md,
  },
});
