import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Chip } from "@/src/components/detail/Chip";
import { CompareSection } from "@/src/components/detail/CompareSection";
import { InfoRow } from "@/src/components/detail/InfoRow";
import { SectionCard } from "@/src/components/detail/SectionCard";
import { StatTile } from "@/src/components/detail/StatTile";
import { EmptyState } from "@/src/components/EmptyState";
import { carsMoch } from "@/src/data/carsMoch";
import { countryName } from "@/src/data/countries";
import { dictionary } from "@/src/data/dictionary";
import {
  getIdentificationRows,
  getPerformanceStats,
  getSpecRows,
} from "@/src/data/formatters";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

export default function CarDetails() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { carId } = useLocalSearchParams<{ carId: string }>();
  const car = carsMoch.find((item) => item.info.id === Number(carId));

  if (!car) {
    return (
      <>
        <Stack.Screen options={{ title: "Not found" }} />
        <EmptyState
          title="Car not found"
          message="This car is not in the catalog."
        />
      </>
    );
  }

  const identification = getIdentificationRows(car);
  const stats = getPerformanceStats(car);
  const specs = getSpecRows(car);

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <Stack.Screen options={{ title: car.info.model }} />

      <Image
        source={{ uri: car.info.image }}
        style={[styles.hero, { backgroundColor: theme.surface }]}
      />

      <View style={styles.titleBlock}>
        <Text style={[styles.brand, { color: theme.accentText }]}>
          {car.info.brand}
        </Text>
        <Text style={[styles.model, { color: theme.textPrimary }]}>
          {car.info.model}
        </Text>
        <View style={styles.chips}>
          <Chip label={car.specs.type} />
          <Chip
            label={countryName(car.info.countryCode)}
            leading={
              <CountryFlag
                isoCode={car.info.countryCode.toLowerCase()}
                size={12}
              />
            }
          />
        </View>
      </View>

      <SectionCard title="Identification">
        {identification.map((row, index) => (
          <InfoRow
            key={row.key}
            label={row.label}
            value={row.value}
            isLast={index === identification.length - 1}
          />
        ))}
      </SectionCard>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Performance
        </Text>
        <View style={styles.tiles}>
          {stats.map((stat) => (
            <StatTile key={stat.key} stat={stat} />
          ))}
        </View>
      </View>

      <SectionCard title="Specifications">
        {specs.map((row, index) => (
          <InfoRow
            key={row.key}
            label={row.label}
            value={row.value}
            isLast={index === specs.length - 1}
          />
        ))}
      </SectionCard>

      <SectionCard title={dictionary.history.curiosities}>
        {car.history.curiosities.map((text, index) => (
          <Text
            key={index}
            style={[
              styles.curiosity,
              { color: theme.textPrimary },
              index < car.history.curiosities.length - 1 && {
                borderBottomColor: theme.separator,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            {text}
          </Text>
        ))}
      </SectionCard>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {dictionary.history.appearances}
        </Text>
        <View style={styles.chips}>
          {car.history.appearances.map((appearance) => (
            <Chip key={appearance} label={appearance} />
          ))}
        </View>
      </View>

      <CompareSection car={car} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  hero: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: radius.lg,
    borderCurve: "continuous",
  },
  titleBlock: {
    gap: spacing.xs,
  },
  brand: {
    ...typography.eyebrow,
  },
  model: {
    ...typography.title,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.eyebrow,
    paddingHorizontal: spacing.xs,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  curiosity: {
    ...typography.body,
    lineHeight: 22,
    paddingVertical: spacing.md,
  },
});
