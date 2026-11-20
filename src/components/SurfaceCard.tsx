import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { radius } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type SurfaceCardProps = {
  children?: ReactNode;
  // recipiente externo (a borda): largura, flex, margens
  style?: StyleProp<ViewStyle>;
  // miolo, onde mora o conteúdo: padding, gap
  contentStyle?: StyleProp<ViewStyle>;
  cornerRadius?: number;
};

const RIM = 1;

// Miolo em degradê sutil e borda de 1 pt em degradê (aro de luz no canto superior esquerdo). Preenche o espaço
// recebido (flex: 1 nos dois níveis), então o card não encolhe abaixo do vizinho da linha.
export function SurfaceCard({
  children,
  style,
  contentStyle,
  cornerRadius = radius.lg,
}: SurfaceCardProps) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.cardRimStart, theme.cardRimEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.fill,
        { borderRadius: cornerRadius, padding: RIM },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.cardFillTop, theme.cardFillBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.fill,
          styles.inner,
          { borderRadius: cornerRadius - RIM },
          contentStyle,
        ]}
      >
        {children}
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    borderCurve: "continuous",
  },
  inner: {
    overflow: "hidden",
  },
});
