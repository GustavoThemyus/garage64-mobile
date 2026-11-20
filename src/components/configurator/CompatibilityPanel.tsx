import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { BuildWarning } from "@/src/types/build";

// Diz se o carro suporta a configuração (spec 5.3). Configuração inválida é só
// um aviso: o usuário vê o que está errado e por quê, e ainda pode salvar.
export function CompatibilityPanel({ warnings }: { warnings: BuildWarning[] }) {
  const theme = useTheme();
  const compatible = warnings.length === 0;
  const tone = compatible ? theme.positive : theme.negative;

  return (
    <View
      style={[styles.panel, { backgroundColor: theme.surface, borderColor: tone }]}
      accessibilityRole="alert"
    >
      <View style={styles.header}>
        <Ionicons
          name={compatible ? "checkmark-circle" : "warning"}
          size={22}
          color={tone}
        />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {compatible ? "Compatible build" : "Compatibility warnings"}
        </Text>
      </View>
      {compatible ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          This car supports every choice you made.
        </Text>
      ) : (
        warnings.map((warning) => (
          <Text
            key={warning.code}
            style={[styles.message, { color: theme.textPrimary }]}
          >
            {`• ${warning.message}`}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    ...typography.headline,
  },
  message: {
    ...typography.body,
  },
});
