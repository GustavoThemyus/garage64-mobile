import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import Animated from "react-native-reanimated";

import { GlassSurface } from "@/src/components/GlassSurface";
import { usePressScale } from "@/src/components/usePressScale";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { Car } from "../types/car";

interface CarCardProps {
  car: Car;
  cardWidth: number;
  onPress: () => void;
}

export default function CarCard({ car, onPress, cardWidth }: CarCardProps) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Animated.View
      style={[
        styles.shadow,
        { width: cardWidth, shadowColor: theme.shadow },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${car.info.brand} ${car.info.model}`}
      >
        <GlassSurface style={styles.card} interactive>
          <View style={styles.imageWrap}>
            <Image source={{ uri: car.info.image }} style={styles.image} />
            <View
              style={[
                styles.flagBadge,
                { backgroundColor: theme.surfaceTranslucent },
              ]}
            >
              <CountryFlag
                isoCode={car.info.countryCode.toLowerCase()}
                size={10}
              />
            </View>
          </View>

          <Text
            style={[styles.model, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {car.info.model}
          </Text>
          <Text
            style={[styles.details, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {car.info.brand} · {car.info.year}
          </Text>

          <View style={styles.footer}>
            <View
              style={[
                styles.typeChip,
                { backgroundColor: theme.badgeBackground },
              ]}
            >
              <Text
                style={[styles.typeText, { color: theme.badgeText }]}
                numberOfLines={1}
              >
                {car.specs.type}
              </Text>
            </View>
            <Text style={[styles.power, { color: theme.accentText }]}>
              {car.performance.hp}
              <Text style={styles.powerUnit}> HP</Text>
            </Text>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // A sombra fica num wrapper porque o card recorta o conteúdo (overflow hidden),
  // e no iOS isso cortaria a própria sombra.
  shadow: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
    padding: spacing.md,
    gap: spacing.xs,
  },
  imageWrap: {
    marginBottom: spacing.sm,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 12,
    borderCurve: "continuous",
    resizeMode: "cover",
  },
  flagBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.sm,
    borderCurve: "continuous",
  },
  model: {
    ...typography.headline,
  },
  details: {
    ...typography.label,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  typeChip: {
    flexShrink: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  typeText: {
    ...typography.eyebrow,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  power: {
    flexShrink: 0,
    fontSize: 20,
    fontWeight: "700",
  },
  powerUnit: {
    fontSize: 12,
    fontWeight: "600",
  },
});
