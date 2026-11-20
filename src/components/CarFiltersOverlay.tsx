import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { FilterSection } from "@/src/components/FilterSection";
import { GlassSurface } from "@/src/components/GlassSurface";
import { carsMoch } from "../data/carsMoch";
import { FilterCriteria } from "../data/filterCars";
import { getFilterOptions } from "../data/filterOptions";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  toggleFilter: (category: keyof FilterCriteria, value: string) => void;
  selectedFilters: FilterCriteria;
  resultCount: number;
};

// Painel de filtros sobre o catálogo. É aberto pelo botão do header, fecha tocando
// fora ou em "Show N cars". Fica montado sempre pra a saída poder animar.
export function CarFiltersOverlay({
  isOpen,
  onClose,
  onClear,
  toggleFilter,
  selectedFilters,
  resultCount,
}: Props) {
  const theme = useTheme();
  const options = useMemo(() => getFilterOptions(carsMoch), []);

  const hasSelection =
    selectedFilters.selectedBrand.length > 0 ||
    selectedFilters.selectedCountry.length > 0 ||
    selectedFilters.selectedType.length > 0;

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
            <FilterSection
              title="Brand"
              options={options.brands}
              selected={selectedFilters.selectedBrand}
              onToggle={(value) => toggleFilter("selectedBrand", value)}
            />
            <FilterSection
              title="Country"
              options={options.countries}
              selected={selectedFilters.selectedCountry}
              onToggle={(value) => toggleFilter("selectedCountry", value)}
            />
            <FilterSection
              title="Type"
              options={options.types}
              selected={selectedFilters.selectedType}
              onToggle={(value) => toggleFilter("selectedType", value)}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={onClear}
              disabled={!hasSelection}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              style={{ opacity: hasSelection ? 1 : 0.4 }}
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
                {resultCount === 1 ? "Show 1 car" : `Show ${resultCount} cars`}
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
