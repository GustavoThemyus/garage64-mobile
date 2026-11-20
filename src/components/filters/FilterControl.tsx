import { useState } from "react";
import { Platform } from "react-native";

import { FilterPanel } from "@/src/components/FilterPanel";
import { FilterToolbarButton } from "@/src/components/FilterToolbarButton";
import { FilterPanelContent } from "./FilterPanelContent";
import { NativeFilterMenu } from "./NativeFilterMenu";
import { FilterMenuModel } from "./types";

// iOS: balão nativo. O menu nativo do header não desenha ícone no Android (só aceita imagem) e a web não tem
// toolbar, então ali o botão abre um painel. Precisa estar dentro de uma tela do Stack.
export function FilterControl({ model }: { model: FilterMenuModel }) {
  if (Platform.OS === "ios") return <NativeFilterMenu model={model} />;
  return <PanelFilterControl model={model} />;
}

function PanelFilterControl({ model }: { model: FilterMenuModel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FilterToolbarButton
        onPress={() => setOpen((current) => !current)}
        active={open || model.active}
      />
      <FilterPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        onClear={model.onClear}
        canClear={model.canClear}
        doneLabel={`Show ${model.resultLabel}`}
      >
        <FilterPanelContent sections={model.sections} />
      </FilterPanel>
    </>
  );
}
