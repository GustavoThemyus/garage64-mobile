// Imports
import { carsMoch } from "@/src/data/carsMoch";
import { Text, View, StyleSheet } from "react-native"; // Imports dos componentes do React Native
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/theme/useTheme";
import { dictionary } from "@/src/data/dictionary";

// Função da tela de detalhes do carro.
export default function CarDetails() {
  const theme = useTheme();
  const { carId } = useLocalSearchParams();
  const selectedCar = carsMoch.find((car) => car.info.id === Number(carId));

  if (!selectedCar) {
    return <Text>Not found</Text>;
  }

  const carDetail = Object.entries(selectedCar.specs).map(
    ([fieldName, fieldValue]) => (
      <View key={fieldName}>
        <Text style={{ color: theme.textPrimary }}>{fieldName}</Text>
      </View>
    ),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.textPrimary }}>{selectedCar.info.model}</Text>
      {/* Por enquanto apenas um título simples */}
      <View>{carDetail}</View>
    </View>
  );
}

// Estilização dessa tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
