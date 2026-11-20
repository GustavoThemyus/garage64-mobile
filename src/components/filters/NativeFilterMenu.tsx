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

// O filtro como balão nativo do iOS: um UIMenu ancorado no botão do header. No
// iOS 26 o sistema o abre em vidro, saindo do próprio botão, e posiciona e
// recorta sozinho. Cada categoria é um submenu.
//
// Escolha múltipla (marca, país, tipo) usa unstable_keepPresented: o balão não
// fecha a cada toque. Em contrapartida o iOS recria o menu a cada escolha, o que
// fecha o submenu aberto e volta pro menu principal (limitação documentada pelo
// Expo). Escolha única fecha o balão ao escolher, que é o esperado.
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
