import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";

import { useTheme } from "@/src/theme/useTheme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} color={color as string} size={size} />
  );
}

// Na web o NativeTabs cai num fallback simples, então a web tem a própria barra
// de tabs clássica, pintada com os mesmos tokens do resto do app.
export default function TabLayoutWeb() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accentText,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="(catalog)"
        options={{ title: "Catalog", tabBarIcon: tabIcon("car-sport") }}
      />
      <Tabs.Screen
        name="(builds)"
        options={{ title: "Builds", tabBarIcon: tabIcon("construct") }}
      />
      <Tabs.Screen
        name="(assistant)"
        options={{ title: "Assistant", tabBarIcon: tabIcon("chatbubbles") }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{ title: "Settings", tabBarIcon: tabIcon("settings") }}
      />
    </Tabs>
  );
}
