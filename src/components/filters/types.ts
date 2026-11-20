// Descrição neutra de um filtro, sem UI: alimenta o balão do iOS e o painel do Android e da web.

export type FilterOptionItem = { value: string; label: string };

export type MultiSection = {
  kind: "multi";
  id: string;
  title: string;
  options: FilterOptionItem[];
  selected: string[];
  onToggle: (value: string) => void;
};

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
  // ex.: "14 cars"
  resultLabel: string;
  // há algum filtro aplicado
  active: boolean;
  canClear: boolean;
  onClear: () => void;
  sections: FilterMenuSection[];
};
