import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { ReactNode, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useTheme, useThemeController } from "@/src/theme/useTheme";

// Vidro só no iOS 26+, e desligado com "Reduzir transparência".
export function useGlassAvailable(): boolean {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    let alive = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
      if (alive) setReduceTransparency(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceTransparencyChanged",
      setReduceTransparency,
    );
    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);

  const supported =
    Platform.OS === "ios" &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable();

  return supported && !reduceTransparency;
}

type GlassSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
};

export function GlassSurface({
  children,
  style,
  interactive = false,
}: GlassSurfaceProps) {
  const theme = useTheme();
  const { scheme } = useThemeController();
  const glass = useGlassAvailable();

  if (glass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={scheme}
        isInteractive={interactive}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
