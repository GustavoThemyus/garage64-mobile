// Paletas do app. Nenhum componente escreve cor direto: tudo sai daqui via useTheme().
// Os nomes descrevem o PAPEL da cor, não o valor.
//
// accent       preenchimentos (botão, switch ligado, barra). Texto sobre ele usa onAccent.
// accentText   o amarelo quando é TEXTO ou ícone sobre superfície. No claro o amarelo
//              puro não tem contraste sobre branco, então vira um âmbar escuro.
//
// cardRim*   a borda dos cards: um degradê claro no canto de cima que some no de baixo,
//             o brilho de aro que dá volume sem usar o vidro do sistema.
// cardFill*  o preenchimento do card, um degradê bem sutil de cima pra baixo.
// cardPressOverlay  a camada que clareia o card enquanto ele é pressionado.
//
// O amarelo é um ouro (matiz 43). O limão anterior (matiz 52) ficava neon e, ao
// escurecer, virava oliva. Com matiz dourado, escurecer continua dourado.
const dark = {
  background: "#131313",
  surface: "#1E1E1E",
  surfaceElevated: "#2A2A2C",
  surfaceTranslucent: "rgba(30,30,30,0.4)",
  scrim: "rgba(0,0,0,0.55)",
  cardRimStart: "rgba(255,255,255,0.34)",
  cardRimEnd: "rgba(255,255,255,0.05)",
  cardFillTop: "#272727",
  cardFillBottom: "#191919",
  cardPressOverlay: "rgba(255,255,255,0.035)",
  border: "#333333",
  separator: "#747474",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  badgeBackground: "#4E4E4E",
  badgeText: "#F2F2F7",
  accent: "#DEA71B",
  accentText: "#DEA71B",
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
  cardRimStart: "rgba(0,0,0,0.16)",
  cardRimEnd: "rgba(0,0,0,0.04)",
  cardFillTop: "#FFFFFF",
  cardFillBottom: "#F5F5F8",
  cardPressOverlay: "rgba(0,0,0,0.04)",
  border: "#D1D1D6",
  separator: "#C6C6C8",
  textPrimary: "#000000",
  textSecondary: "#6C6C70",
  badgeBackground: "#E5E5EA",
  badgeText: "#3C3C43",
  accent: "#DEA71B",
  accentText: "#8A6000",
  onAccent: "#000000",
  track: "#D1D1D6",
  positive: "#248A3D",
  negative: "#D70015",
  shadow: "#000000",
};

export const colors = { dark, light };

export type ThemeScheme = keyof typeof colors;
