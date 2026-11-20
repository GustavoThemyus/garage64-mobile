import { Stack } from "expo-router";

import { useTabStackOptions } from "@/src/navigation/useTabStackOptions";

export default function SettingsLayout() {
  const options = useTabStackOptions();

  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
