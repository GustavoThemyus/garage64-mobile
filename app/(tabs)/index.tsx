import CarCard from "@/src/components/CarCard";
import { cars } from "@/src/data/cars";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Garage64</Text>

      <FlatList
        data={cars}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.info.id.toString()}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => console.log("Clicou no " + item.info.model)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
  },

  row: {
    gap: 15,
    marginBottom: 12,
    justifyContent: "center",
  },
});
