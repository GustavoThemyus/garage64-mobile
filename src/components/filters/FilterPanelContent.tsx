import { ChoiceSection } from "@/src/components/ChoiceSection";
import { FilterSection } from "@/src/components/FilterSection";
import { FilterMenuSection } from "./types";

// Desenha as seções de um FilterMenuModel dentro do FilterPanel.
export function FilterPanelContent({ sections }: { sections: FilterMenuSection[] }) {
  return (
    <>
      {sections.map((section) =>
        section.kind === "multi" ? (
          <FilterSection
            key={section.id}
            title={section.title}
            options={section.options}
            selected={section.selected}
            onToggle={section.onToggle}
          />
        ) : (
          <ChoiceSection<string>
            key={section.id}
            title={section.title}
            options={section.options.map(({ value, label }) => ({
              id: value,
              label,
            }))}
            value={section.value}
            onChange={section.onChange}
          />
        ),
      )}
    </>
  );
}
