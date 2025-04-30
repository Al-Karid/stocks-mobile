import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        {/* If BottomSheetModal is broken on Iphone, mind newly added ActionSheetProvider */}
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings/index"
              options={{
                title: "Settings",
                headerLargeTitle: true,
                headerBackTitle: "Dashboard",
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
                title: "Stock Details",
                presentation: "modal",
                animation: "slide_from_bottom",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="alerts/index"
              options={{
                title: "Alerts",
              }}
            />
            <Stack.Screen
              name="alerts/form"
              options={{
                title: "New Alert",
                presentation: "modal",
                animation: "slide_from_bottom",
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
                headerShadowVisible: false,
              }}
            />
          </Stack>

          <Toast />
        </BottomSheetModalProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
