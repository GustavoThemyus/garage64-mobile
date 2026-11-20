import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import type { FilterOption } from "@/src/data/filterOptions";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type FilterSectionProps = {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
};

export function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: FilterSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View layout={LinearTransition.duration(200)}>
      <Pressable
        onPress={() => setExpanded((open) => !open)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${title} filters`}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
        <View style={styles.headerRight}>
          {selected.length > 0 ? (
            <View style={[styles.count, { backgroundColor: theme.accent }]}>
              <Text style={[styles.countText, { color: theme.onAccent }]}>
                {selected.length}
              </Text>
            </View>
          ) : null}
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={16}
            color={theme.textSecondary}
          />
        </View>
      </Pressable>

      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          style={styles.options}
        >
          {options.map((option) => (
            <View key={option.value} style={styles.optionRow}>
              <Text style={[styles.optionText, { color: theme.textPrimary }]}>
                {option.label}
              </Text>
              <Switch
                trackColor={{ true: theme.accent }}
                value={selected.includes(option.value)}
                onValueChange={() => onToggle(option.value)}
              />
            </View>
          ))}
        </Animated.View>
      ) : null}

      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.headline,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
  },
  options: {
    paddingBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  optionText: {
    ...typography.body,
    flexShrink: 1,
    paddingRight: spacing.md,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.5,
  },
});
