import { Stack } from "expo-router";

import { useTabStackOptions } from "@/src/navigation/useTabStackOptions";

export default function AssistantLayout() {
  const options = useTabStackOptions();

  return (
    <Stack screenOptions={options}>
      <Stack.Screen
        name="assistant"
        options={{ title: "Assistant", headerLargeTitle: false }}
      />
    </Stack>
  );
}
