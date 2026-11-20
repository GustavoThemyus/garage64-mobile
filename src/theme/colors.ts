// Paletas do app. Nenhum componente escreve cor direto: tudo sai daqui via useTheme().
// Os nomes descrevem o PAPEL da cor, não o valor.
//
// accent       preenchimentos (botão, switch ligado, barra). Texto sobre ele usa onAccent.
// accentText   o amarelo quando é TEXTO ou ícone sobre superfície. No claro o amarelo
//              puro não tem contraste sobre branco, então vira um âmbar escuro.
const dark = {
  background: "#131313",
  surface: "#1E1E1E",
  surfaceElevated: "#2A2A2C",
  surfaceTranslucent: "rgba(30,30,30,0.4)",
  scrim: "rgba(0,0,0,0.55)",
  border: "#333333",
  separator: "#747474",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  badgeBackground: "#4E4E4E",
  badgeText: "#F2F2F7",
  accent: "#E4C413",
  accentText: "#E4C413",
  onAccent: "#000000",
  track: "#3A3A3C",
  positive: "#30D158",
  negative: "#FF453A",
  shadow: "#000000",
};

export type ThemeColors = typeof dark;

const light: ThemeColors = {
  background: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceElevated: "#E9E9EE",
  surfaceTranslucent: "rgba(255,255,255,0.6)",
  scrim: "rgba(0,0,0,0.35)",
  border: "#D1D1D6",
  separator: "#C6C6C8",
  textPrimary: "#000000",
  textSecondary: "#6C6C70",
  badgeBackground: "#E5E5EA",
  badgeText: "#3C3C43",
  accent: "#E0B400",
  accentText: "#8A6700",
  onAccent: "#000000",
  track: "#D1D1D6",
  positive: "#248A3D",
  negative: "#D70015",
  shadow: "#000000",
};

export const colors = { dark, light };

export type ThemeScheme = keyof typeof colors;
