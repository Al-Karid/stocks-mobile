import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            headerBackground() {
              return (
                <View
                  style={{
                    backgroundColor: "#121212",
                    height: "100%",
                    width: "100%",
                  }}
                />
              );
            },
            
          }}
        />
        <Stack.Screen
          name="palmares"
          options={{
            title: "Palmarès",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="stocks"
          options={{
            title: "Stocks",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="watchlist"
          options={{
            title: "Watchlist",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "Stock Details",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            title: "New Transaction",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="holdings"
          options={{
            title: "Holdings",
            headerLargeTitle: true,
          }}
        />
      </Stack>
      <Toast />
    </>
  );
}
