import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useTheme } from "@/src/theme/useTheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: React.ComponentProps<typeof FontAwesome>["color"];
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen // Primeiro botão clicável da primeira tab no footer
        name="index" // É o ID da tab, que tem que ser o mesmo nome do arquivo dessa tab
        options={{
          title: "Catalog", // Título da tab no header
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="code" color={color as string} />
          ), // Propriedade que retorna o ícone do botão pra acessar essa aba. O expo chama ela e já define a cor padrão quando tá ativa/inativa
          // Propriedade que retorna o componente que será exibido na direita do header
        }}
      />
    </Tabs>
  );
}
