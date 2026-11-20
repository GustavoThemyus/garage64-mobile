import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type SegmentedControlProps<T extends string> = {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
};

// Controle segmentado no estilo iOS: uma cápsula com o item ativo destacado.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={[styles.track, { backgroundColor: theme.surfaceElevated }]}
      accessibilityRole="radiogroup"
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              selected && { backgroundColor: theme.surface },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? theme.textPrimary : theme.textSecondary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: radius.pill,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: 9,
  },
  label: {
    ...typography.label,
    fontWeight: "600",
  },
});
