import {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Feedback de toque dos cards: ao pressionar, o card clareia por inteiro e ao
// soltar volta. Não escala. A curva foi medida num vídeo de referência: o
// preenchimento sobe em ~150 ms (rápido e depois assenta), segura enquanto o
// dedo está em cima e desce em ~120 ms. A intensidade é o token
// cardPressOverlay, de propósito bem mais fraca que a do vídeo (cerca de um terço).
const PRESS_IN_MS = 150;
const PRESS_OUT_MS = 120;

export function usePressHighlight() {
  // 0 = em repouso, 1 = pressionado. PressHighlight lê isto como opacidade.
  const progress = useSharedValue(0);

  return {
    progress,
    onPressIn: () => {
      progress.value = withTiming(1, {
        duration: PRESS_IN_MS,
        easing: Easing.out(Easing.cubic),
      });
    },
    onPressOut: () => {
      progress.value = withTiming(0, {
        duration: PRESS_OUT_MS,
        easing: Easing.inOut(Easing.quad),
      });
    },
  };
}
