import { AspirationId } from "../types/build";

// O mock descreve a aspiração de formas diferentes: specs diz "Sequential
// Twin-Turbocharged", rules diz "Twin Turbo", "Twin-Turbo" ou só "Turbo".
// Comparar o texto cru reprovaria o próprio carro de fábrica, então tudo vira
// um id canônico por palavra-chave. A ordem importa: "twin" antes de "turbo".
export function normalizeAspiration(text: string): AspirationId | null {
  const value = text.toLowerCase();
  if (value.includes("supercharg")) return "supercharged";
  if (value.includes("twin")) return "twin-turbo";
  if (value.includes("turbo")) return "single-turbo";
  if (value.includes("natural")) return "naturally-aspirated";
  return null;
}
