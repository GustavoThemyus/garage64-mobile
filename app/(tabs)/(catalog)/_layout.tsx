import { Stack } from "expo-router";

import { useTabStackOptions } from "@/src/navigation/useTabStackOptions";

export default function CatalogLayout() {
  const options = useTabStackOptions();

  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="index" options={{ title: "Catalog" }} />
    </Stack>
  );
}
