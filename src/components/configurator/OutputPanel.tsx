import { StyleSheet, Text, View } from "react-native";

import { StatTile } from "@/src/components/detail/StatTile";
import { getPerformanceStats } from "@/src/data/formatters";
import { formatDelta } from "@/src/engine/delta";
import { EvaluatedBuild } from "@/src/engine/evaluate";
import { spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type OutputPanelProps = {
  result: EvaluatedBuild;
  factory: EvaluatedBuild;
};

export function OutputPanel({ result, factory }: OutputPanelProps) {
  const theme = useTheme();
  const stats = getPerformanceStats(result.performance);
  const base = factory.performance;
  const now = result.performance;

  const deltas: Record<string, ReturnType<typeof formatDelta>> = {
    hp: formatDelta(now.hp, base.hp, 0, "higher"),
    torque: formatDelta(now.torque[0], base.torque[0], 0, "higher"),
    topSpeed: formatDelta(now.topSpeed[0], base.topSpeed[0], 0, "higher"),
    acceleration: formatDelta(now.acceleration, base.acceleration, 1, "lower"),
    consumption: formatDelta(now.consumption, base.consumption, 1, "higher"),
  };

  const weightDelta = formatDelta(result.weightKg, factory.weightKg, 0, "lower");

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>Result</Text>
      <View style={styles.tiles}>
        {stats.map((stat) => (
          <StatTile key={stat.key} stat={stat} delta={deltas[stat.key]} />
        ))}
      </View>
      <Text style={[styles.weight, { color: theme.textSecondary }]}>
        Weight {result.weightKg} kg
        {weightDelta ? ` (${weightDelta.text} kg)` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  title: {
    ...typography.eyebrow,
    paddingHorizontal: spacing.xs,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  weight: {
    ...typography.label,
    paddingHorizontal: spacing.xs,
  },
});
