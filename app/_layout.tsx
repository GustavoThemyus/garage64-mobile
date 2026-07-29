import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Função do layout da aplicação. O layout é o componente raiz que engloba absolutamente todas as telas.
export default function RootLayout() {
  const [loaded, error] = useFonts({
    // useFonts é um hook que carrega as fontes necessáras para a aplicação, e tá sendo aplicando a constante de array loaded e error.
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // De forma bem didática pra você jamais esquecer: useEffect é um hook que executa um efeito lateral quando uma ação é realizada (no caso, quando loaded muda).
    // Quando loaded muda, o efeito é executado. Se loaded for true, a splash screen é escondida. A splash screen é uma tela de carregamento que aparece enquanto as fontes estão sendo carregadas.
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]); // O array vazio signicia que o efeito é executado apenas uma vez, quando o componente é montado. Nesse caso, como não está vazio, o efeito é executado sempre que loaded muda.

  // Quando loaded for false, o componente retorna null, e a splash screen é exibida.
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// Essa é a função do layout de navegação, que basicamente define a estrutura de navegação da aplicação.
function RootLayoutNav() {
  // Define os temas escuro ou claro.
  const colorScheme = useColorScheme(); // Define o esquema de cores com base no dispositivo. Esse hook foi aplicado a constante colorScheme.

  return (
    // Theme provider é um componente que envolve toda a aplicação e fornece o tema claro ou escuro para os componentes filhos.
    // Se colorScheme for "dark", o DarkTheme vai ser fornecido. Se não, vai ser DefaultTheme.
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Stack é um tipo de navegação, como uma pilha de telas. Quando abre uma, vai por cima da tela anterior. A anterior fica esperando. Se você clica em voltar, a tela anterior vai aparecer novamente. */}
        {/* Stack.Screen define as telas da navegação. As primeira (tabs) é a tela principal, que mostra os carros disponíveis. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* O primeiro (tabs) é todo o sistema de abas, pois contém o layout das abas e as telas dentro delas. */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        {/* O modal leva pra tela de informações ao clicar no i de informação. */}
        <Stack.Screen name="carDetails" options={{ title: "Details" }} />
        {/* O carDetails é a tela de detalhes do carro, que mostra informações adicionais sobre o carro selecionado. */}
      </Stack>
    </ThemeProvider>
  );
}
