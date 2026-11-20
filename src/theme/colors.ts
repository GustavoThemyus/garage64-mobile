// Nenhum componente escreve cor direto: tudo sai daqui via useTheme(). Os nomes descrevem o papel, não o valor.
// accent é o preenchimento (texto sobre ele usa onAccent); accentText é o amarelo como texto ou ícone, um âmbar
// escuro no tema claro por contraste. O amarelo é um ouro (matiz 43): o limão (matiz 52) virava oliva ao escurecer.
// cardRim* é a borda em degradê dos cards, cardFill* o preenchimento e cardPressOverlay o clareado ao toque.
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
