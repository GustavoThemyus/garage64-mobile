import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { GlassSurface } from "@/src/components/GlassSurface";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type FilterPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  // false quando não há nada marcado: "Clear all" fica apagado.
  canClear: boolean;
  doneLabel: string;
  children: ReactNode;
};

// Casca dos painéis de filtro (Catalog e Builds): fundo que fecha ao tocar fora,
// painel de vidro com rolagem e rodapé com "Clear all" e o botão de concluir.
// Fica montada sempre pra a saída poder animar.
export function FilterPanel({
  isOpen,
  onClose,
  onClear,
  canClear,
  doneLabel,
  children,
}: FilterPanelProps) {
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close filters"
      />

      <Animated.View
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(120)}
        style={[styles.shadow, { shadowColor: theme.shadow }]}
      >
        <GlassSurface style={styles.panel}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {children}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={onClear}
              disabled={!canClear}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              style={{ opacity: canClear ? 1 : 0.4 }}
            >
              <Text style={[styles.clearText, { color: theme.accentText }]}>
                Clear all
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              style={[styles.doneButton, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.doneText, { color: theme.onAccent }]}>
                {doneLabel}
              </Text>
            </Pressable>
          </View>
        </GlassSurface>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 90,
  },
  shadow: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.lg,
    left: spacing.lg,
    maxWidth: 360,
    maxHeight: "78%",
    alignSelf: "flex-end",
    zIndex: 100,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  panel: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    flexShrink: 1,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  clearText: {
    ...typography.headline,
  },
  doneButton: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  doneText: {
    ...typography.headline,
    fontSize: 15,
  },
});
