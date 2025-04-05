import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Stocks" }} />
      <Stack.Screen
        name="details"
        options={{
          title: "Details",
          presentation: "modal",
          headerShown: true,
          gestureEnabled: true,
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
