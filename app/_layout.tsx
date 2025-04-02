import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="stocks" 
        options={{ 
          title: "Stocks",
          headerShown: true,
        }} 
      />
    </Stack>
  );
}