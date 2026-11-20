import type { NativeStackNavigationOptions } from "expo-router/native-stack";

import { useTheme } from "@/src/theme/useTheme";

// Opções comuns do Stack que cada tab carrega dentro dela (é o Stack que dá o
// header à tab nativa): título grande no estilo iOS e cores do tema.
//
// O título usa a cor de texto, não o amarelo. O amarelo fica pros botões e
// ícones (headerTintColor): título amarelo sumia sobre as fotos claras dos carros.
//
// O contraste do header sobre o conteúdo é do sistema: no iOS 26 o header é
// transparente e o sistema desenha o efeito de borda de rolagem (um desfoque
// suave) sobre a lista que passa por baixo. Isso só funciona se a lista da tela
// for o PRIMEIRO filho da tela. É assim que o título grande também colapsa
// no título pequeno ao rolar.
export function useTabStackOptions(): NativeStackNavigationOptions {
  const theme = useTheme();

  return {
    headerLargeTitle: true,
    headerTintColor: theme.accentText,
    headerTitleStyle: { color: theme.textPrimary },
    headerLargeTitleStyle: { color: theme.textPrimary },
    contentStyle: { backgroundColor: theme.background },
  };
}
