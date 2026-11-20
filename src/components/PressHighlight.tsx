import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "@/src/theme/useTheme";

// Camada que clareia o card pressionado. Vai como último filho do SurfaceCard,
// que já recorta nos cantos arredondados. Não captura toque.
export function PressHighlight({ progress }: { progress: SharedValue<number> }) {
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.cardPressOverlay },
        animatedStyle,
      ]}
    />
  );
}
