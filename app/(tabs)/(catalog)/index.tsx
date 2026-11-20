import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import CarCard from "@/src/components/CarCard";
import { EmptyState } from "@/src/components/EmptyState";
import { FilterControl } from "@/src/components/filters/FilterControl";
import { buildCarFilterModel } from "@/src/components/filters/filterModels";
import { useCars } from "@/src/data/CarsProvider";
import { filterCars, FilterCriteria } from "@/src/data/filterCars";
import { spacing } from "@/src/theme/tokens";

const EMPTY_FILTERS: FilterCriteria = {
  selectedBrand: [],
  selectedType: [],
  selectedCountry: [],
};

const GRID_GAP = 15;

export default function CatalogScreen() {
  const { cars, ready, error } = useCars();
  const { width } = useWindowDimensions();
  const [filters, setFilters] = useState<FilterCriteria>(EMPTY_FILTERS);

  function toggleFilter(category: keyof FilterCriteria, value: string) {
    const list = filters[category];
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    setFilters({ ...filters, [category]: next });
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  const columns = width < 430 ? 2 : width < 650 ? 3 : 4;
  const availableWidth = width - spacing.lg * 2;
  const cardWidth = (availableWidth - (columns - 1) * GRID_GAP) / columns;

  const carsForShow = filterCars(cars, filters);
  const filterModel = buildCarFilterModel({
    cars,
    filters,
    onToggle: toggleFilter,
    onClear: clearFilters,
    resultCount: carsForShow.length,
  });

  if (error) return <EmptyState title="Catalog unavailable" message={error} />;
  if (!ready) return <EmptyState title="Loading catalog" />;

  // A lista precisa ser o primeiro filho da tela: só assim o iOS liga o título grande à rolagem.
  return (
    <>
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

      <FilterControl model={filterModel} />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    gap: GRID_GAP,
    marginBottom: spacing.md,
    // linha incompleta alinha à esquerda, na coluna dos cards de cima
    justifyContent: "flex-start",
  },
});
