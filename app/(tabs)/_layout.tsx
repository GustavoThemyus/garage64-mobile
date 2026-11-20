import { NativeTabs } from "expo-router/native-tabs";

import { useTheme } from "@/src/theme/useTheme";

// Tab bar nativa. No iOS 26+ o sistema desenha a barra flutuante de vidro, com
// a cápsula no item selecionado: forma e fundo não são configuráveis, só a cor
// do item ativo. No Android vira a barra Material. A web usa _layout.web.tsx.
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
