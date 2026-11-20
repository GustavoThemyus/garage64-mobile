import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import CarCard from "@/src/components/CarCard";
import { CarFiltersOverlay } from "@/src/components/CarFiltersOverlay";
import { carsMoch } from "@/src/data/carsMoch";
import { filterCars, FilterCriteria } from "@/src/data/filterCars";
import { spacing } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

const EMPTY_FILTERS: FilterCriteria = {
  selectedBrand: [],
  selectedType: [],
  selectedCountry: [],
};

const GRID_GAP = 15;

export default function CatalogScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>(EMPTY_FILTERS);

  // Marca ou desmarca um valor dentro de uma categoria, sem mexer nas outras.
  function toggleFilter(category: keyof FilterCriteria, value: string) {
    const list = filters[category];
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    setFilters({ ...filters, [category]: next });
  }

  function toggleFilterPanel() {
    setIsFilterOpen((open) => !open);
  }

  const columns = width < 430 ? 2 : width < 650 ? 3 : 4;
  const availableWidth = width - spacing.lg * 2;
  const cardWidth = (availableWidth - (columns - 1) * GRID_GAP) / columns;

  const carsForShow = filterCars(carsMoch, filters);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {Platform.OS === "web" ? (
        // A web não tem Stack.Toolbar, então o botão vai no header como view.
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable
                onPress={toggleFilterPanel}
                accessibilityLabel="Filters"
                style={styles.webFilterButton}
              >
                <Ionicons
                  name="options-outline"
                  size={24}
                  color={theme.accentText}
                />
              </Pressable>
            ),
          }}
        />
      ) : (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon={
              isFilterOpen
                ? "line.3.horizontal.decrease.circle.fill"
                : "line.3.horizontal.decrease.circle"
            }
            accessibilityLabel="Filters"
            onPress={toggleFilterPanel}
          />
        </Stack.Toolbar>
      )}

      <FlatList
        data={carsForShow}
        numColumns={columns}
        key={columns}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.info.id.toString()}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            cardWidth={cardWidth}
            onPress={() =>
              router.push({
                pathname: "/carDetails",
                params: { carId: item.info.id },
              })
            }
          />
        )}
      />

      <CarFiltersOverlay
        isOpen={isFilterOpen}
        onToggle={toggleFilterPanel}
        toggleFilter={toggleFilter}
        selectedFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  row: {
    gap: GRID_GAP,
    marginBottom: spacing.md,
    justifyContent: "center",
  },
  webFilterButton: {
    paddingHorizontal: spacing.md,
  },
});
