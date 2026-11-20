import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Pressable, StyleSheet, Text } from "react-native";

import { spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type LinkRowProps = {
  label: string;
  url: string;
  isLast?: boolean;
};

export function LinkRow({ label, url, isLast = false }: LinkRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(url)}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={[
        styles.row,
        !isLast && {
          borderBottomColor: theme.separator,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
      <Ionicons name="open-outline" size={18} color={theme.accentText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.body,
    flex: 1,
  },
});
