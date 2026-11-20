import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type ChipProps = {
  label: string;
  leading?: ReactNode;
};

export function Chip({ label, leading }: ChipProps) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.badgeBackground }]}>
      {leading}
      <Text style={[styles.text, { color: theme.badgeText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  text: {
    ...typography.label,
  },
});
