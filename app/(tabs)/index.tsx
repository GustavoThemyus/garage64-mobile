import CarCard from "@/src/components/CarCard";
import { CarFiltersOverlay } from "@/src/components/CarFiltersOverlay";
import { carsMoch } from "@/src/data/carsMoch";
import { filterCars } from "@/src/data/filterCars";
import { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  function toggleFilter(filterName: string) {
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filterName));
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  }

  function handleToggleFilter() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFilterOpen((prev) => !prev);
  }

  let columns: number = width < 430 ? 2 : width < 650 ? 3 : 4;
  let availableWidth: number = width - styles.container.padding * 2;
  let totalSpacing: number = (columns - 1) * styles.row.gap;
  let cardWidth: number = (availableWidth - totalSpacing) / columns;

  const carsForShow = filterCars(carsMoch, { selectedFilters });

  return (
    <View style={styles.container}>
      <CarFiltersOverlay
        isOpen={isFilterOpen}
        onToggle={handleToggleFilter}
        toggleFilter={toggleFilter}
        selectedFilters={selectedFilters}
      />
      <FlatList
        data={carsForShow}
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
