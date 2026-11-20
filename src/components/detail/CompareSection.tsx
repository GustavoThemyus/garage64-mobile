import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { ActionButton } from "@/src/components/ActionButton";
import { CarPickerModal } from "@/src/components/detail/CarPickerModal";
import { CompareBars } from "@/src/components/detail/CompareBars";
import { useCars } from "@/src/data/CarsProvider";
import { compareCars } from "@/src/engine/compare";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { Car } from "@/src/types/car";

export function CompareSection({ car }: { car: Car }) {
  const theme = useTheme();
  const { getCar } = useCars();
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rivalId, setRivalId] = useState<number | null>(null);

  const rival = useMemo(
    () => (rivalId === null ? null : (getCar(rivalId) ?? null)),
    [getCar, rivalId],
  );
  const comparisons = useMemo(
    () => (rival ? compareCars(car, rival) : []),
    [car, rival],
  );

  const aWins = comparisons.filter((c) => c.winner === "a").length;
  const bWins = comparisons.filter((c) => c.winner === "b").length;

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={styles.root}>
      <ActionButton
        label="Compare"
        variant="secondary"
        onPress={() => setExpanded((open) => !open)}
        icon={
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={theme.textPrimary}
          />
        }
      />

      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(120)}
          style={[styles.panel, { backgroundColor: theme.surface }]}
        >
          {rival ? (
            <>
              <View style={styles.rival}>
                <Image
                  source={{ uri: rival.info.image }}
                  style={[styles.thumb, { backgroundColor: theme.border }]}
                />
                <View style={styles.rivalText}>
                  <Text
                    style={[styles.rivalLabel, { color: theme.textSecondary }]}
                  >
                    Comparing with
                  </Text>
                  <Text
                    style={[styles.rivalName, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {rival.info.model}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setPickerOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Change car"
                >
                  <Text style={[styles.change, { color: theme.accentText }]}>
                    Change
                  </Text>
                </Pressable>
              </View>

              <Text style={[styles.summary, { color: theme.textSecondary }]}>
                {car.info.model} leads in {aWins}, {rival.info.model} leads in{" "}
                {bWins}.
              </Text>

              <CompareBars
                key={rival.info.id}
                nameA={car.info.model}
                nameB={rival.info.model}
                comparisons={comparisons}
              />
            </>
          ) : (
            <ActionButton
              label="Choose car"
              onPress={() => setPickerOpen(true)}
            />
          )}
        </Animated.View>
      ) : null}

      <CarPickerModal
        visible={pickerOpen}
        excludeCarId={car.info.id}
        selectedCarId={rivalId}
        onSelect={(id) => {
          setRivalId(id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  panel: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
    gap: spacing.lg,
  },
  rival: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  thumb: {
    width: 64,
    height: 44,
    borderRadius: radius.sm,
    borderCurve: "continuous",
  },
  rivalText: {
    flex: 1,
    gap: 2,
  },
  rivalLabel: {
    ...typography.caption,
  },
  rivalName: {
    ...typography.headline,
  },
  change: {
    ...typography.headline,
  },
  summary: {
    ...typography.label,
  },
});
