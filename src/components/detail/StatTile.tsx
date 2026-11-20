import { StyleSheet, Text, View } from "react-native";

import type { PerformanceStat } from "@/src/data/formatters";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

// Um número de performance em destaque (potência, torque, velocidade...).
export function StatTile({ stat }: { stat: PerformanceStat }) {
  const theme = useTheme();

  return (
    <View style={[styles.tile, { backgroundColor: theme.surface }]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {stat.label}
      </Text>
      <Text style={[styles.value, { color: theme.textPrimary }]}>
        {stat.value}
        <Text style={[styles.unit, { color: theme.accentText }]}>
          {" "}
          {stat.unit}
        </Text>
      </Text>
      {stat.detail ? (
        <Text style={[styles.detail, { color: theme.textSecondary }]}>
          {stat.detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexBasis: "47%",
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
    gap: 2,
  },
  label: {
    ...typography.eyebrow,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
  },
  detail: {
    ...typography.caption,
  },
});
