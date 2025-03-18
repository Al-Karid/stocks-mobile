import { Stack } from "expo-router";

export default function PortfolioLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="details" options={{ title: "Details"}} />
        <Stack.Screen name="add-holding" options={{ title: "Add Holding"}} />
      </Stack>
  );
}