import { Stack } from "expo-router";

import { FilterMenuModel, FilterMenuSection } from "./types";

function sectionTitle(section: FilterMenuSection): string {
  if (section.kind === "multi") {
    return section.selected.length > 0
      ? `${section.title} (${section.selected.length})`
      : section.title;
  }
  const current = section.options.find((option) => option.value === section.value);
  return current ? `${section.title}: ${current.label}` : section.title;
}

// Escolha múltipla usa unstable_keepPresented: o balão não fecha a cada toque, mas o iOS recria o menu e o
// submenu aberto volta ao menu principal (limitação documentada do Expo).
export function NativeFilterMenu({ model }: { model: FilterMenuModel }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        title={model.resultLabel}
        accessibilityLabel="Filters"
        icon={
          model.active
            ? "line.3.horizontal.decrease.circle.fill"
            : "line.3.horizontal.decrease.circle"
        }
      >
        {model.sections.map((section) => (
          <Stack.Toolbar.Menu key={section.id} title={sectionTitle(section)}>
            {section.kind === "multi"
              ? section.options.map((option) => (
                  <Stack.Toolbar.MenuAction
                    key={option.value}
                    isOn={section.selected.includes(option.value)}
                    unstable_keepPresented
                    onPress={() => section.onToggle(option.value)}
                  >
                    {option.label}
                  </Stack.Toolbar.MenuAction>
                ))
              : section.options.map((option) => (
                  <Stack.Toolbar.MenuAction
                    key={option.value}
                    isOn={section.value === option.value}
                    onPress={() => section.onChange(option.value)}
                  >
                    {option.label}
                  </Stack.Toolbar.MenuAction>
                ))}
          </Stack.Toolbar.Menu>
        ))}

        <Stack.Toolbar.MenuAction
          destructive
          icon="xmark.circle"
          disabled={!model.canClear}
          onPress={model.onClear}
        >
          Clear all
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
