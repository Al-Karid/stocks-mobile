import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNotificationHandler } from "@/services/notificationService";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect, useCallback } from "react";
import { useAppInitializer } from "@/data/configs/initDatabases";
import '@/i18n'; // Import your i18n configuration

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  fade: true,
});

export default function Layout() {
  useNotificationHandler();
  const { initializeAppData } = useAppInitializer();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeAppData();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ActionSheetProvider>
        <SafeAreaProvider>
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
                name="stocks/stocks"
                options={{
                  title: "Stocks",
                  headerLargeTitle: true,
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="alerts/index"
                options={{
                  title: "Alerts",
                  headerLargeTitle: true,
                  headerBackTitle: "Dashboard",
                }}
              />
              <Stack.Screen
                name="alerts/notifications"
                options={{
                  title: "Notifications",
                  headerLargeTitle: true,
                  headerBackTitle: "Dashboard",
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
        </SafeAreaProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
