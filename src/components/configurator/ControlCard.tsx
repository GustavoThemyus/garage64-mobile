import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type ControlCardProps = {
  title: string;
  // Valor atual, mostrado à direita do título (ex.: "2.6 L").
  value?: string;
  hint?: string;
  children?: ReactNode;
};

// Um controle do configurador por linha (spec 5.1): título, valor atual e o controle.
export function ControlCard({ title, value, hint, children }: ControlCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        {value ? (
          <Text style={[styles.value, { color: theme.accentText }]}>{value}</Text>
        ) : null}
      </View>
      {hint ? (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>{hint}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    ...typography.headline,
  },
  value: {
    ...typography.headline,
  },
  hint: {
    ...typography.label,
  },
});
