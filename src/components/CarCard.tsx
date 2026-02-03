import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Car } from "../types/car";

interface CarCardProps {
  car: Car;
  onPress: () => void;
}

export default function CarCard({ car, onPress }: CarCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: car.info.image }} style={styles.image} />
        <View style={styles.flagBadge}>
          <CountryFlag isoCode={car.info.countryCode.toLowerCase()} size={10} />
        </View>
      </View>
      <Text style={styles.model}>{car.info.model}</Text>
      <Text style={styles.details}>
        {car.info.brand} - {car.info.year}
      </Text>
      <View style={styles.typeBadge}>
        <Text style={styles.tyoeText}>{car.specs.type}</Text>
      </View>
      <Text style={styles.power}>{car.performance.hp} HP</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: "48%",
    backgroundColor: "#1E1E1E",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
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
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  typeBadge: {
    backgroundColor: "#4E4E4E",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },

  tyoeText: {
    color: "#1E1E1E",
    fontSize: 10,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },

  model: {
    color: "#888",
    fontSize: 17,
    fontWeight: "bold",
  },

  details: {
    color: "#888",
    fontSize: 13,
  },

  power: {
    color: "#FFD700",
    fontSize: 18,
    marginBottom: 2,
    marginTop: 10,
    fontWeight: "bold",
  },
});
