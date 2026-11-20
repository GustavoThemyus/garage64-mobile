import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { PressHighlight } from "@/src/components/PressHighlight";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { usePressHighlight } from "@/src/components/usePressHighlight";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { Car } from "../types/car";

interface CarCardProps {
  car: Car;
  cardWidth: number;
  onPress: () => void;
}

// A estrutura não depende do conteúdo: nome e marca em uma linha, tipo e HP em linhas próprias, e o card
// estica até a altura do vizinho da linha. Antes, o rodapé quebrava só em alguns tipos e desalinhava a grade.
export default function CarCard({ car, onPress, cardWidth }: CarCardProps) {
  const theme = useTheme();
  const { progress, onPressIn, onPressOut } = usePressHighlight();

  return (
    <View
      style={[styles.shadow, { width: cardWidth, shadowColor: theme.shadow }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`${car.info.brand} ${car.info.model}`}
      >
        <SurfaceCard contentStyle={styles.card}>
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

          <View style={styles.spacer} />

          <View
            style={[styles.typeChip, { backgroundColor: theme.badgeBackground }]}
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
          <PressHighlight progress={progress} />
        </SurfaceCard>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // A sombra fica num wrapper: o card recorta o conteúdo (overflow hidden), o que cortaria a própria sombra no iOS.
  shadow: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  pressable: {
    flex: 1,
  },
  card: {
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
  spacer: {
    flexGrow: 1,
    minHeight: spacing.sm,
  },
  typeChip: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  typeText: {
    ...typography.eyebrow,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  power: {
    fontSize: 22,
    fontWeight: "700",
  },
  powerUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
});
