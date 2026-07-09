// screens/NotificationScreen.tsx
import React, { useMemo } from "react";
import { View, Text, SectionList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import NotificationCard from "@/components/alerts/NotificationCard";
import { useNotificationStore } from "@/stores/notificationStore";
import { groupNotifications } from "@/utils/notificationUtils";
import { useTranslation } from "react-i18next";


const NotificationScreen = () => {

  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();

  const { notifications } = useNotificationStore();
  const grouped = useMemo(() => groupNotifications(notifications ?? []), [notifications]);
  
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
          <Text className="text-sm font-semibold mt-4 mb-1.5 text-gray-500 pl-2">{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: headerHeight + 16 }}
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
