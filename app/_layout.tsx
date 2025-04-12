import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="palmares"
        options={{
          title: "Palmarès",
          headerShown: true,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="stocks"
        options={{
          title: "Stocks",
          headerShown: true,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          headerShown: true,
          gestureEnabled: true,
        }}
      />
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
      <Stack.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          headerShown: true,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="holdings"
        options={{
          title: "Holdings",
          headerShadowVisible: false,
          headerShown: true,
          gestureEnabled: true,
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
