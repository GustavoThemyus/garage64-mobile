// Tudo isso acima é gerado automático com a criação do projeto Expo
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Hook que serve pra alternar entre modo claro e escuro (ainda não verifiquei, mas é provável que esteja inutilizado no resto do código)
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // É uma propriedade que define a cor de destaque do botão. E define o light como tema padrão se não tiver nenhum tema definido.
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen // Primeiro botão clicável da primeira tab no footer
        name="index" // É o ID da tab, que tem que ser o mesmo nome do arquivo dessa tab
        options={{
          title: "Catalog", // Título da tab no header
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />, // Propriedade que retorna o ícone do botão pra acessar essa aba. O expo chama ela e já define a cor padrão quando tá ativa/inativa
          // Propriedade que retorna o componente que será exibido na direita do header
          headerRight: () => (
            // Componente Link que redireciona para a aba modal
            <Link href="/modal" asChild>
              <Pressable>
                {/*Componente que detecta toques (como o button) e dá acesso ao estado pressed (se está sendo pressionando)*/}
                {({ pressed }) => (
                  // É uma render prop, você passa uma função como filho, e o pressable retorna o estado atual (true ou false) pra decidir como desenhar conteúdo
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen // Segundo botão clicável da segunda tab do footer
        name="two" // ID da tab
        options={{
          title: "Tab Two", // Título da tab no header
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />, // Propriedade que retorna o ícone do botão pra acessar essa aba. O expo chama ela e já define a cor padrão quando tá ativa/inativa
        }}
      />
    </Tabs>
  );
}
