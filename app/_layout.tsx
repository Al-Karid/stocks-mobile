import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
      name="index" 
      options={{ 
        title: "Home",
        headerShown: false,
        gestureEnabled: false, 
        }} />
      <Stack.Screen 
      name="palmares" 
      options={{ 
        title: "Palmarès",
        headerShown: true,
        gestureEnabled: true, 
        }} />
      <Stack.Screen
        name="details"
        options={{
          title: "Stock Details",
          presentation: "modal",
          headerShown: true,
          gestureEnabled: true,
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
