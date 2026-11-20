import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { radius } from "@/src/theme/tokens";
import { useTheme } from "@/src/theme/useTheme";

type SurfaceCardProps = {
  children?: ReactNode;
  // Vai no recipiente externo (a borda). Use pra largura, flex e margens.
  style?: StyleProp<ViewStyle>;
  // Estilo do miolo, onde o conteúdo mora (padding, gap).
  contentStyle?: StyleProp<ViewStyle>;
  cornerRadius?: number;
};

const RIM = 1;

// O card do Garage64: miolo com um degradê sutil e uma borda de 1 pt em degradê,
// clara no canto superior esquerdo e sumindo no inferior direito (o brilho de aro).
// Não usa o vidro do iOS, então fica igual em qualquer plataforma.
//
// Preenche o espaço que receber (flex: 1 nos dois níveis): quem usa decide a
// altura, e o card nunca encolhe abaixo do vizinho da mesma linha.
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
