import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  formatMetricValue,
  MetricComparison,
} from "@/src/engine/compare";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type CompareBarProps = {
  name: string;
  comparison: MetricComparison;
  side: "a" | "b";
};

// Uma barra por carro. O verde vai até o score do carro (1 = o melhor dos dois).
// No carro pior, o trecho entre o score dele e o teto do outro fica vermelho.
function CompareBar({ name, comparison, side }: CompareBarProps) {
  const theme = useTheme();
  const { metric } = comparison;
  const own = comparison[side];
  const isWorse = comparison.winner !== "tie" && comparison.winner !== side;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 650 });
  }, [progress]);

  const greenStyle = useAnimatedStyle(() => ({
    width: `${own.score * progress.value * 100}%`,
  }));
  const redStyle = useAnimatedStyle(() => ({
    left: `${own.score * progress.value * 100}%`,
    width: `${(1 - own.score) * progress.value * 100}%`,
  }));
  const pointerStyle = useAnimatedStyle(() => ({
    left: `${own.score * progress.value * 100}%`,
  }));

  return (
    <View
      style={styles.bar}
      accessible
      accessibilityLabel={`${name}, ${metric.label}, ${formatMetricValue(metric, own.value)}`}
    >
      <View style={styles.barHeader}>
        <Text
          style={[styles.carName, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text style={[styles.value, { color: theme.textPrimary }]}>
          {formatMetricValue(metric, own.value)}
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: theme.track }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: theme.positive },
            greenStyle,
          ]}
        />
        {isWorse ? (
          <Animated.View
            style={[
              styles.fill,
              { backgroundColor: theme.negative },
              redStyle,
            ]}
          />
        ) : null}
        <Animated.View
          style={[
            styles.pointer,
            {
              backgroundColor: theme.textPrimary,
              borderColor: isWorse ? theme.negative : theme.positive,
            },
            pointerStyle,
          ]}
        />
      </View>
    </View>
  );
}

type CompareBarsProps = {
  nameA: string;
  nameB: string;
  comparisons: MetricComparison[];
};

export function CompareBars({ nameA, nameB, comparisons }: CompareBarsProps) {
  const theme = useTheme();

  return (
    <View style={styles.list}>
      {comparisons.map((comparison) => {
        const { metric, winner, gapPercent } = comparison;
        const verdict =
          winner === "tie"
            ? "Tie"
            : `${winner === "a" ? nameA : nameB} +${gapPercent}%`;

        return (
          <View key={metric.key} style={styles.metric}>
            <View style={styles.metricHeader}>
              <Text style={[styles.metricLabel, { color: theme.textPrimary }]}>
                {metric.label}
              </Text>
              <Text style={[styles.verdict, { color: theme.positive }]}>
                {verdict}
              </Text>
            </View>
            <CompareBar name={nameA} comparison={comparison} side="a" />
            <CompareBar name={nameB} comparison={comparison} side="b" />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xl,
  },
  metric: {
    gap: spacing.sm,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.md,
  },
  metricLabel: {
    ...typography.headline,
  },
  verdict: {
    ...typography.caption,
    flexShrink: 1,
  },
  bar: {
    gap: spacing.xs,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  carName: {
    ...typography.caption,
    flex: 1,
  },
  value: {
    ...typography.label,
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  pointer: {
    position: "absolute",
    top: 0,
    width: 10,
    height: 10,
    marginLeft: -5,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
});
