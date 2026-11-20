import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/useTheme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} color={color as string} size={size} />
  );
}

// O NativeTabs cai num fallback simples na web.
export default function TabLayoutWeb() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accentText,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          // altura explícita pra o rótulo não ser cortado; a folga de baixo é a barra do home indicator
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 12, lineHeight: 14 },
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
