// screens/NotificationScreen.tsx
import React, { useMemo } from "react";
import { View, Text, SectionList, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationCard from "@/components/alerts/NotificationCard";
import { useNotificationStore } from "@/stores/notificationStore";
import { groupNotifications } from "@/utils/notificationUtils";
import { useTranslation } from "react-i18next";
import { Notification } from "@/types/alerts";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "mock-1",
    title: "NFC A > 4 000 FCFA",
    body: "L'action NFC A a dépassé votre seuil de 4 000 FCFA et se négocie actuellement à 4 250 FCFA.",
    notification_type: "above",
    stock_symbol: "NFC",
    timestamp: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "ETI C < 1 500 FCFA",
    body: "L'action ETI C est passée sous votre seuil de 1 500 FCFA et se négocie actuellement à 1 420 FCFA.",
    notification_type: "below",
    stock_symbol: "ETI",
    timestamp: new Date().toISOString(),
  },
  {
    id: "mock-3",
    title: "BOA B > 6 000 FCFA",
    body: "L'action BOA B a dépassé votre seuil de 6 000 FCFA et se négocie actuellement à 6 180 FCFA.",
    notification_type: "above",
    stock_symbol: "BOA",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

const NotificationScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 44;

  const { notifications } = useNotificationStore();

  const data = useMemo(() => {
    if (__DEV__) {
      const hasRealNotifications = notifications && notifications.length > 0;
      return hasRealNotifications ? notifications : MOCK_NOTIFICATIONS;
    }
    return notifications ?? [];
  }, [notifications]);

  const grouped = useMemo(() => groupNotifications(data), [data]);

  return (
    <View className="flex-1 px-4">
      {/* <Text style={styles.header}>Notifications</Text> */}
      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            description={item.body}
            time={item.timestamp}
            type={item.notification_type}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-sm font-semibold mt-4 mb-1.5 text-gray-500 pl-2">
            {title}
          </Text>
        )}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: Platform.select({ ios: headerHeight + 16 }),
        }}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-16 px-8">
            <View className="mb-8">
              <View className="w-28 h-28 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
                  <Feather name="bell" size={32} color="#d1d5db" />
                </View>
              </View>
            </View>
            <Text className="text-lg font-semibold text-gray-400 mb-2">
              {t("no-notifications-yet")}
            </Text>
            <Text className="text-sm text-gray-300 text-center leading-5">
              {t("notifications-will-appear-here")}
            </Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationScreen;
