import { Stack } from "expo-router";

import { useTabStackOptions } from "@/src/navigation/useTabStackOptions";

export default function BuildsLayout() {
  const options = useTabStackOptions();

  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="builds" options={{ title: "Builds" }} />
    </Stack>
  );
}
