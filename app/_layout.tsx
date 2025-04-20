import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="stocks/palmares"
          options={{
            title: "Palmarès",
            headerLargeTitle: true,
            headerBackTitle: "Retour",
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
          name="watchlist/index"
          options={{
            title: "Watchlist",
            headerLargeTitle: true,
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name="portfolio/holdings"
          options={{
            title: "Holdings",
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
      </Stack>
      <Toast />
    </>
  );
}