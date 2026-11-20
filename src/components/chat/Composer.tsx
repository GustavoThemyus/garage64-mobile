import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type ComposerProps = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled: boolean;
};

export function Composer({ value, onChange, onSend, disabled }: ComposerProps) {
  const theme = useTheme();
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.bar}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Ask about cars, specs or builds"
        placeholderTextColor={theme.textSecondary}
        multiline
        maxLength={500}
        accessibilityLabel="Message"
        style={[
          styles.input,
          { backgroundColor: theme.surface, color: theme.textPrimary },
        ]}
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        style={[
          styles.send,
          { backgroundColor: canSend ? theme.accent : theme.surfaceElevated },
        ]}
      >
        <Ionicons
          name="arrow-up"
          size={20}
          color={canSend ? theme.onAccent : theme.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    ...typography.body,
    flex: 1,
    maxHeight: 120,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    minHeight: 44,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
