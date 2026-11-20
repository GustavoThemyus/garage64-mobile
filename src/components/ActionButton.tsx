import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  disabled?: boolean;
};

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
}: ActionButtonProps) {
  const theme = useTheme();
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.accent : theme.surfaceElevated,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: primary ? theme.onAccent : theme.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  label: {
    ...typography.headline,
  },
});
