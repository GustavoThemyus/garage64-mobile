// Imports
import { carsMoch } from "@/src/data/carsMoch"; // Import dos dados mocados dos carros
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
} from "react-native"; // Imports dos componentes do React Native
import { useState } from "react"; // Import do useState do React
import { Link } from "expo-router"; // Import do Link do Expo Router. Ele é usado pra navegação entre telas. É diferente do Stack porque não tem uma pilha de telas, e sim uma navegação entre elas.

// Função da tela de detalhes do carro.
export default function CarDetails() {
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
