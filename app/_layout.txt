import { Stack } from "expo-router";
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
          }}
        />
        <Stack.Screen
          name="stocks/palmares"
          options={{
            title: "Palmarès",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="stocks/index"
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
          name="stocks/details"
          options={{
            title: "Stock Details",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="transactions/new"
          options={{
            title: "New Transaction",
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="transactions/history"
          options={{
            title: "Transaction History",
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
          name="portfolio/details"
          options={{
            title: "Portfolio Details",
            presentation: "modal",
            animation: "slide_from_bottom",
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
