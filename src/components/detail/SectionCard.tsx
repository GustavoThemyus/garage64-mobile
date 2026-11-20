import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

// Bloco de conteúdo da Car Detail: título pequeno em caixa alta e um cartão
// sólido embaixo. Conteúdo fica em superfície sólida, o vidro é pra controles.
export function SectionCard({ title, children }: SectionCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    ...typography.eyebrow,
    paddingHorizontal: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});
