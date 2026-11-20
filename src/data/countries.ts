// O mock guarda o país como código ISO de 2 letras (info.countryCode).
// Esta tabela converte pro nome que o usuário lê. Código sem entrada aparece como está.
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
