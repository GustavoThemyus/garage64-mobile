import { StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type InfoRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

// Linha rótulo à esquerda, valor à direita. Valores longos (freios, rodas)
// quebram de linha em vez de empurrar o rótulo.
export function InfoRow({ label, value, isLast = false }: InfoRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomColor: theme.separator,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.body,
    flexShrink: 0,
  },
  value: {
    ...typography.body,
    flex: 1,
    textAlign: "right",
  },
});
