import { useMemo } from "react";

import { ChoiceSection } from "@/src/components/ChoiceSection";
import { FilterPanel } from "@/src/components/FilterPanel";
import { FilterSection } from "@/src/components/FilterSection";
import { carsMoch } from "@/src/data/carsMoch";
import {
  BuildFilterCriteria,
  CompatibilityFilter,
  HP_RANGES,
  hasActiveBuildFilters,
  HpRangeId,
} from "@/src/engine/filterBuilds";
import { Build } from "@/src/types/build";

type BuildFiltersPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  criteria: BuildFilterCriteria;
  onChange: (criteria: BuildFilterCriteria) => void;
  // Todas as builds salvas: as opções de carro e marca saem só do que existe.
  builds: Build[];
  resultCount: number;
};

const COMPATIBILITY_OPTIONS: { id: CompatibilityFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "compatible", label: "Compatible" },
  { id: "warnings", label: "With warnings" },
];

function toggled<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

// Filtros da tab Builds (spec 6.2): carro base, marca, faixa de HP e
// compatibilidade, todos opcionais e combináveis.
export function BuildFiltersPanel({
  isOpen,
  onClose,
  onClear,
  criteria,
  onChange,
  builds,
  resultCount,
}: BuildFiltersPanelProps) {
  const { carOptions, brandOptions } = useMemo(() => {
    const usedIds = new Set(builds.map((build) => build.carId));
    const usedCars = carsMoch.filter((car) => usedIds.has(car.info.id));
    const brands = Array.from(new Set(usedCars.map((car) => car.info.brand)));

    return {
      carOptions: usedCars.map((car) => ({
        value: String(car.info.id),
        label: car.info.model,
      })),
      brandOptions: brands.map((brand) => ({ value: brand, label: brand })),
    };
  }, [builds]);

  return (
    <FilterPanel
      isOpen={isOpen}
      onClose={onClose}
      onClear={onClear}
      canClear={hasActiveBuildFilters(criteria)}
      doneLabel={resultCount === 1 ? "Show 1 build" : `Show ${resultCount} builds`}
    >
      <FilterSection
        title="Base car"
        options={carOptions}
        selected={criteria.carIds.map(String)}
        onToggle={(value) =>
          onChange({ ...criteria, carIds: toggled(criteria.carIds, Number(value)) })
        }
      />
      <FilterSection
        title="Brand"
        options={brandOptions}
        selected={criteria.brands}
        onToggle={(value) =>
          onChange({ ...criteria, brands: toggled(criteria.brands, value) })
        }
      />
      <ChoiceSection<HpRangeId>
        title="Power"
        options={HP_RANGES.map(({ id, label }) => ({ id, label }))}
        value={criteria.hpRange}
        onChange={(hpRange) => onChange({ ...criteria, hpRange })}
      />
      <ChoiceSection<CompatibilityFilter>
        title="Compatibility"
        options={COMPATIBILITY_OPTIONS}
        value={criteria.compatibility}
        onChange={(compatibility) => onChange({ ...criteria, compatibility })}
      />
    </FilterPanel>
  );
}
