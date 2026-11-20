import { BetterWhen } from "./compare";

export type DeltaTone = "better" | "worse";

export type Delta = {
  text: string;
  tone: DeltaTone;
};

// Sem diferença visível devolve null. Em aceleração e peso, descer é melhorar.
export function formatDelta(
  value: number,
  base: number,
  decimals: number,
  betterWhen: BetterWhen,
): Delta | null {
  const diff = Number((value - base).toFixed(decimals));
  if (diff === 0) return null;

  const improved = betterWhen === "higher" ? diff > 0 : diff < 0;
  return {
    text: `${diff > 0 ? "+" : "-"}${Math.abs(diff).toFixed(decimals)}`,
    tone: improved ? "better" : "worse",
  };
}
