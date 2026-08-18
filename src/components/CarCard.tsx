import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Car } from "../types/car";
import { useTheme } from "../theme/useTheme";

interface CarCardProps {
  car: Car;
  cardWidth: number;
  onPress: () => void;
}

export default function CarCard({ car, onPress, cardWidth }: CarCardProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: cardWidth,
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: car.info.image }} style={styles.image} />
        <View style={[styles.flagBadge, { shadowColor: theme.shadow }]}>
          <CountryFlag isoCode={car.info.countryCode.toLowerCase()} size={10} />
        </View>
      </View>
      <Text
        style={[styles.model, { color: theme.textSecondary }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {car.info.model}
      </Text>
      <Text style={[styles.details, { color: theme.textSecondary }]}>
        {car.info.brand} - {car.info.year}
      </Text>
      <View
        style={[styles.typeBadge, { backgroundColor: theme.badgeBackground }]}
      >
        <Text style={[styles.typeText, { color: theme.badgeText }]}>
          {car.specs.type}
        </Text>
      </View>
      <Text style={[styles.power, { color: theme.accent }]}>
        {car.performance.hp} HP
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 5,
    resizeMode: "cover",
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 10,
  },

  flagBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
    borderRadius: 4,
    elevation: 4,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  typeBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },

  typeText: {
    fontSize: 10,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },

  model: {
    fontSize: 17,
    fontWeight: "bold",
  },

  details: {
    fontSize: 13,
  },

  power: {
    fontSize: 18,
    marginBottom: 2,
    marginTop: 10,
    fontWeight: "bold",
  },
});
