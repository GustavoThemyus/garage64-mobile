// Descrição neutra de um filtro, sem nenhuma UI. A mesma descrição alimenta o
// balão nativo do iOS (NativeFilterMenu) e o painel do Android e da web
// (FilterPanel), então os dois sempre mostram as mesmas opções e o mesmo estado.

export type FilterOptionItem = { value: string; label: string };

// Várias opções podem estar marcadas ao mesmo tempo (marca, país, tipo...).
export type MultiSection = {
  kind: "multi";
  id: string;
  title: string;
  options: FilterOptionItem[];
  selected: string[];
  onToggle: (value: string) => void;
};

// Exatamente uma opção ativa (faixa de HP, compatibilidade).
export type SingleSection = {
  kind: "single";
  id: string;
  title: string;
  options: FilterOptionItem[];
  value: string;
  onChange: (value: string) => void;
};

export type FilterMenuSection = MultiSection | SingleSection;

export type FilterMenuModel = {
  // Ex.: "14 cars". Vai no topo do balão e no botão "Show 14 cars" do painel.
  resultLabel: string;
  // Há algum filtro aplicado (deixa o ícone do botão preenchido).
  active: boolean;
  canClear: boolean;
  onClear: () => void;
  sections: FilterMenuSection[];
};
