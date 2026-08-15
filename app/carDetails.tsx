// Imports
import { carsMoch } from "@/src/data/carsMoch";
import { Text, View, StyleSheet } from "react-native"; // Imports dos componentes do React Native
import { useLocalSearchParams } from "expo-router";

// Função da tela de detalhes do carro.
export default function CarDetails() {
  const { carId } = useLocalSearchParams();
  const selectedCar = carsMoch.find((car) => car.info.id === Number(carId));
  if (!selectedCar) {
    return <Text>Not found</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedCar.info.model}</Text>
      {/* Por enquanto apenas um título simples */}
    </View>
  );
}

// Estilização dessa tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    flex: 1,
    color: "#fff",
  },
});
