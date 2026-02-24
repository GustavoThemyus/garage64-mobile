import CarCard from "@/src/components/CarCard";
import { CarFiltersOverlay } from "@/src/components/CarFiltersOverlay";
import { carsMoch } from "@/src/data/carsMoch";
import { useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [filters, setFilters] = useState({
    country: null as string | null,
    type: null as string | null,
    minHP: null as number | null,
    maxHP: null as number | null,
  })
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  let columns: number = width < 430 ? 2 : width < 650 ? 3 : 4;
  let availableWidth: number = width - styles.container.padding * 2;
  let totalSpacing: number = (columns - 1) * styles.row.gap;
  let cardWidth: number = (availableWidth - totalSpacing) / columns;

  return (
    <View style={styles.container}>
      <CarFiltersOverlay
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen((prev) => !prev)}
      />
      <FlatList
        data={carsMoch}
        numColumns={columns}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingTop: 50,
          paddingBottom: 10,
        }}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.info.id.toString()}
        key={columns}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => console.log("Clicou no " + item.info.model)}
            cardWidth={cardWidth}
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
    padding: 16,
  },

  row: {
    gap: 15,
    marginBottom: 12,
    justifyContent: "center",
  },
});
