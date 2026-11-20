import { StyleSheet, Text, View } from "react-native";

import { ChatMessage } from "@/src/services/assistant";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const theme = useTheme();
  const isUser = message.role === "user";

  const background = isUser
    ? theme.accent
    : message.isError
      ? theme.surfaceElevated
      : theme.surface;
  const color = isUser
    ? theme.onAccent
    : message.isError
      ? theme.negative
      : theme.textPrimary;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: background },
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text style={[styles.text, { color }]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  rowAssistant: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleUser: {
    borderBottomRightRadius: radius.sm,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: radius.sm,
  },
  text: {
    ...typography.body,
    lineHeight: 24,
  },
});
