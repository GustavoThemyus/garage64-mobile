import { AspirationId } from "../types/build";

// specs e rules escrevem a aspiração com palavras diferentes ("Sequential Twin-Turbocharged" vs "Twin Turbo"), então tudo
// vira um id canônico por palavra-chave. A ordem importa: "twin" antes de "turbo".
export function normalizeAspiration(text: string): AspirationId | null {
  const value = text.toLowerCase();
  if (value.includes("supercharg")) return "supercharged";
  if (value.includes("twin")) return "twin-turbo";
  if (value.includes("turbo")) return "single-turbo";
  if (value.includes("natural")) return "naturally-aspirated";
  return null;
}
