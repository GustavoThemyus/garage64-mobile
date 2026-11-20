import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PressHighlight } from "@/src/components/PressHighlight";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { usePressHighlight } from "@/src/components/usePressHighlight";
import { radius, spacing, typography } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";
import { Build } from "@/src/types/build";
import { Car } from "@/src/types/car";

type BuildCardProps = {
  build: Build;
  // Pode faltar se o carro saiu do catálogo depois da build ser salva.
  car: Car | undefined;
  onPress: () => void;
  onRename: () => void;
  onDelete: () => void;
};

// Card da tab Builds (spec 6.1): o mesmo visual do card do Catalog, em 1 coluna,
// com espaço pra mostrar o resultado calculado e a compatibilidade.
export function BuildCard({
  build,
  car,
  onPress,
  onRename,
  onDelete,
}: BuildCardProps) {
  const theme = useTheme();
  const { progress, onPressIn, onPressOut } = usePressHighlight();
  const { computed, warnings } = build;
  const compatible = warnings.length === 0;
  const tone = compatible ? theme.positive : theme.negative;

  const stats = [
    { label: "HP", value: String(computed.hp) },
    { label: "Nm", value: String(computed.torque[0]) },
    { label: "km/h", value: String(computed.topSpeed[0]) },
    { label: "0-100 s", value: computed.acceleration.toFixed(1) },
    { label: "km/L", value: computed.consumption.toFixed(1) },
  ];

  return (
    <View style={[styles.shadow, { shadowColor: theme.shadow }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`Edit build ${build.name}`}
      >
        <SurfaceCard contentStyle={styles.card}>
          <View style={styles.top}>
            {car ? (
              <Image
                source={{ uri: car.info.image }}
                style={[styles.image, { backgroundColor: theme.border }]}
              />
            ) : (
              <View style={[styles.image, { backgroundColor: theme.border }]} />
            )}

            <View style={styles.info}>
              <Text
                style={[styles.name, { color: theme.textPrimary }]}
                numberOfLines={2}
              >
                {build.name}
              </Text>
              <Text
                style={[styles.base, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {car ? `${car.info.model} · ${car.info.year}` : "Car no longer in the catalog"}
              </Text>
              <View style={styles.badgeRow}>
                <Ionicons
                  name={compatible ? "checkmark-circle" : "warning"}
                  size={16}
                  color={tone}
                />
                <Text style={[styles.badge, { color: tone }]}>
                  {compatible
                    ? "Compatible"
                    : warnings.length === 1
                      ? "1 warning"
                      : `${warnings.length} warnings`}
                </Text>
              </View>
            </View>

            <View style={styles.icons}>
              <Pressable
                onPress={onRename}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Rename ${build.name}`}
              >
                <Ionicons name="pencil" size={18} color={theme.textSecondary} />
              </Pressable>
              <Pressable
                onPress={onDelete}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${build.name}`}
              >
                <Ionicons name="trash-outline" size={18} color={theme.negative} />
              </Pressable>
            </View>
          </View>

          <View
            style={[styles.stats, { borderTopColor: theme.separator }]}
          >
            {stats.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
          <PressHighlight progress={progress} />
        </SurfaceCard>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.lg,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    padding: spacing.md,
    gap: spacing.md,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  image: {
    width: 112,
    aspectRatio: 16 / 10,
    borderRadius: 12,
    borderCurve: "continuous",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...typography.headline,
  },
  base: {
    ...typography.label,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
  },
  badge: {
    ...typography.caption,
    fontWeight: "700",
  },
  icons: {
    alignSelf: "flex-start",
    gap: spacing.lg,
    paddingTop: 2,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 19,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
  },
});
