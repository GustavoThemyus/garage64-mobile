// Medidas e tipografia compartilhadas. Não mudam entre claro e escuro.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

// Pesos como string porque o React Native só aceita "400", "600", "700" etc.
export const typography = {
  title: { fontSize: 28, fontWeight: "700", letterSpacing: 0.3 },
  headline: { fontSize: 17, fontWeight: "600" },
  body: { fontSize: 15, fontWeight: "400" },
  label: { fontSize: 13, fontWeight: "500" },
  caption: { fontSize: 12, fontWeight: "500" },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
} as const;
