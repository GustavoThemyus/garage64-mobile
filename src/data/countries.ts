// Converte o código ISO do mock (info.countryCode) no nome. Código sem entrada aparece como está.
const COUNTRY_NAMES: Record<string, string> = {
  DE: "Germany",
  FR: "France",
  GB: "United Kingdom",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  SE: "Sweden",
  US: "United States",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}
