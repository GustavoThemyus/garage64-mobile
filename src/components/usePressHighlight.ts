import {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Curva medida num vídeo de referência: sobe em ~150 ms, desce em ~120 ms. A intensidade é o token cardPressOverlay.
const PRESS_IN_MS = 150;
const PRESS_OUT_MS = 120;

export function usePressHighlight() {
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
