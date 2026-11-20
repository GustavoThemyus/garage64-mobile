import { NativeTabs } from "expo-router/native-tabs";

import { useTheme } from "@/src/theme/useTheme";

// No iOS 26+ a forma e o fundo da barra são do sistema; só a cor do item ativo é configurável.
export default function TabLayout() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.accentText}>
      <NativeTabs.Trigger name="(catalog)">
        <NativeTabs.Trigger.Label>Catalog</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "car", selected: "car.fill" }}
          md="directions_car"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(builds)">
        <NativeTabs.Trigger.Label>Builds</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "wrench.and.screwdriver",
            selected: "wrench.and.screwdriver.fill",
          }}
          md="build"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(assistant)">
        <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "bubble.left.and.bubble.right",
            selected: "bubble.left.and.bubble.right.fill",
          }}
          md="chat"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
