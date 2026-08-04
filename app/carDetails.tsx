// Imports
import { Text, View, StyleSheet } from "react-native"; // Imports dos componentes do React Native
import { useLocalSearchParams } from "expo-router";

// Função da tela de detalhes do carro.
export default function CarDetails() {
  const { carId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>{" "}
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
  },
});
