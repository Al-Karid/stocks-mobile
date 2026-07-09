import "@/global.css";
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
import "@/i18n"; // Import your i18n configuration
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  fade: true,
});

export default function Layout() {
  const { t } = useTranslation();
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
                  title: t("settings"),
                  headerLargeTitle: true,
                  headerBackTitle: t("dashboard"),
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
              <Stack.Screen
                name="settings/login"
                options={{
                  title: t("login"),
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="settings/register"
                options={{
                  title: t("register"),
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="stocks/details"
                options={{
                  title: t("stock-details"),
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="stocks/stocks"
                options={{
                  title: t("stocks"),
                  headerLargeTitle: true,
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="alerts/index"
                options={{
                  title: t("alerts"),
                  headerLargeTitle: true,
                  headerBackTitle: t("dashboard"),
                }}
              />
              <Stack.Screen
                name="alerts/notifications"
                options={{
                  title: t("notifications"),
                  headerLargeTitle: true,
                  headerBackTitle: t("dashboard"),
                }}
              />
              <Stack.Screen
                name="alerts/form"
                options={{
                  title: t("new-alert"),
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="portfolio/details"
                options={Platform.select({
                  android: {
                    title: t("portfolio-details"),
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  },
                  ios: {
                    // title: t('portfolio-details'),
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    contentStyle: { backgroundColor: "transparent" },
                    headerStyle: { backgroundColor: "transparent" },
                    sheetAllowedDetents: [0.7, 1],
                    sheetInitialDetentIndex: 0,
                    headerTransparent: false,
                    sheetLargestUndimmedDetentIndex: -1,
                  },
                })}
              />
              <Stack.Screen
                name="transactions/new"
                options={{
                  title: t("new-transaction"),
                  presentation: undefined,
                  headerBackButtonDisplayMode: "minimal",
                  headerTransparent: true,
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="transactions/history"
                options={Platform.select({
                  android: {
                    title: t("transaction-history"),
                    presentation: "modal",
                    animation: "slide_from_bottom",
                    headerShadowVisible: false,
                  },
                  ios: {
                    title: t("transaction-history"),
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    contentStyle: { backgroundColor: "transparent" },
                    headerStyle: { backgroundColor: "transparent" },
                    sheetAllowedDetents: [0.7, 1],
                    sheetInitialDetentIndex: 0,
                    headerTransparent: false,
                    sheetLargestUndimmedDetentIndex: -1,
                  },
                })}
              />
            </Stack>

            <Toast />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
