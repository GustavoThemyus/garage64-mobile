import { useMemo } from "react";

import { FilterPanel } from "@/src/components/FilterPanel";
import { FilterSection } from "@/src/components/FilterSection";
import { carsMoch } from "../data/carsMoch";
import { FilterCriteria, hasActiveFilters } from "../data/filterCars";
import { getFilterOptions } from "../data/filterOptions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  toggleFilter: (category: keyof FilterCriteria, value: string) => void;
  selectedFilters: FilterCriteria;
  resultCount: number;
};

// Filtros do Catalog: marca, país e tipo. É aberto pelo botão do header.
export function CarFiltersOverlay({
  isOpen,
  onClose,
  onClear,
  toggleFilter,
  selectedFilters,
  resultCount,
}: Props) {
  const options = useMemo(() => getFilterOptions(carsMoch), []);

  return (
    <FilterPanel
      isOpen={isOpen}
      onClose={onClose}
      onClear={onClear}
      canClear={hasActiveFilters(selectedFilters)}
      doneLabel={resultCount === 1 ? "Show 1 car" : `Show ${resultCount} cars`}
    >
      <FilterSection
        title="Brand"
        options={options.brands}
        selected={selectedFilters.selectedBrand}
        onToggle={(value) => toggleFilter("selectedBrand", value)}
      />
      <FilterSection
        title="Country"
        options={options.countries}
        selected={selectedFilters.selectedCountry}
        onToggle={(value) => toggleFilter("selectedCountry", value)}
      />
      <FilterSection
        title="Type"
        options={options.types}
        selected={selectedFilters.selectedType}
        onToggle={(value) => toggleFilter("selectedType", value)}
      />
    </FilterPanel>
  );
}
