// app/_layout.tsx
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings/index"
            options={{
              title: "Settings",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="settings/login"
            options={{
              title: "Login",
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="settings/register"
            options={{
              title: "Register",
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="stocks/details"
            options={{
              title: "Details",
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShadowVisible: false
            }}
          />
          {/* <Stack.Screen
            name="watchlist/index"
            options={{
              title: "Watchlist",
              headerLargeTitle: true,
              headerBackTitle: "Retour",
            }}
          /> */}
          {/* <Stack.Screen
            name="portfolio/holdings"
            options={{
              title: "Holdings",
              headerLargeTitle: true,
              headerBackTitle: "Retour",
            }}
          /> */}
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
              headerShadowVisible: false
            }}
          />
        </Stack>
        <Toast />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}