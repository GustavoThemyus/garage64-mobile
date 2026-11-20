import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type ChoiceSectionProps<T extends string> = {
  title: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
};

// Seção de painel de filtro com escolha única, em chips (faixa de HP,
// compatibilidade). As de múltipla escolha usam FilterSection.
export function ChoiceSection<T extends string>({
  title,
  options,
  value,
  onChange,
}: ChoiceSectionProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.accent
                    : theme.badgeBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? theme.onAccent : theme.badgeText },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.headline,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: {
    ...typography.label,
    fontWeight: "600",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.5,
  },
});
