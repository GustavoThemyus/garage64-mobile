import { StyleSheet, Switch, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type SwitchControlProps = {
  title: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

// Interruptor nativo da plataforma, sem texto "yes/no" (spec 5.1).
export function SwitchControl({
  title,
  hint,
  value,
  onChange,
}: SwitchControlProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        {hint ? (
          <Text style={[styles.hint, { color: theme.textSecondary }]}>{hint}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.accent }}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing.lg,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.headline,
  },
  hint: {
    ...typography.label,
  },
});
