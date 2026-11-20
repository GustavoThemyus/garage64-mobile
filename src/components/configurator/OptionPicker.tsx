import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ControlCard } from "@/src/components/configurator/ControlCard";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

export type PickerOption = {
  id: string;
  label: string;
  isFactory?: boolean;
};

type OptionPickerProps = {
  title: string;
  options: PickerOption[];
  value: string;
  onChange: (id: string) => void;
};

// Lista de linhas e não segmented control: os textos de fábrica (rodas, freios) são longos.
export function OptionPicker({
  title,
  options,
  value,
  onChange,
}: OptionPickerProps) {
  const theme = useTheme();

  return (
    <ControlCard title={title}>
      <View style={styles.list}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.row,
                {
                  backgroundColor: selected
                    ? theme.surfaceElevated
                    : "transparent",
                  borderColor: selected ? theme.accent : theme.separator,
                },
              ]}
            >
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={selected ? theme.accentText : theme.textSecondary}
              />
              <Text
                style={[styles.label, { color: theme.textPrimary }]}
                numberOfLines={3}
              >
                {option.label}
              </Text>
              {option.isFactory ? (
                <Text style={[styles.badge, { color: theme.textSecondary }]}>
                  Factory
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ControlCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    borderCurve: "continuous",
    padding: spacing.md,
  },
  label: {
    ...typography.body,
    flex: 1,
  },
  badge: {
    ...typography.caption,
  },
});
