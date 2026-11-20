import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING = { damping: 18, stiffness: 320 };

// Efeito de toque dos cards: encolhe um pouco enquanto pressionado e volta com mola.
// Uso: <Animated.View style={animatedStyle}><Pressable onPressIn onPressOut .../>
export function usePressScale(pressedScale = 0.97) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    onPressIn: () => {
      scale.value = withSpring(pressedScale, SPRING);
    },
    onPressOut: () => {
      scale.value = withSpring(1, SPRING);
    },
  };
}
