import { AlertData } from "@/types/alerts";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlertStore } from "@/stores/alertStore";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import { getDevicePushToken } from "@/services/pushTokenService";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useTranslation } from "react-i18next";

export default function AlertFormModal() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 44;

  const { symbol: stockSymbol, title: stockTitle, alertId: alertToEditId } =
    useLocalSearchParams<{
      symbol?: string;
      title?: string;
      alertId?: string;
    }>();
  const { alerts, addAlert, updateAlert, notificationChannels } =
    useAlertStore();
  const { decreaseUserContraintCounts } = useSettingsStore();
  const { fetchStocks } = useStockRepository();

  const [currentStockPrice, setCurrentStockPrice] = useState<number | null>(
    null,
  );

  const [alertType, setAlertType] = useState<"below" | "above">("above");
  const [alertThreshold, setAlertThreshold] = useState("2500");
  const [enabled, setEnabled] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<AlertData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (alertToEditId) {
      const editingAlert = alerts?.find(
        (alert) => alert.id === Number(alertToEditId),
      );
      if (!editingAlert) return;
      setAlertToEdit(editingAlert);
      setAlertType(editingAlert.alertType);
      setAlertThreshold(String(editingAlert.value));
      setEnabled(editingAlert.enabled);
    }
  }, [alertToEditId]);

  useEffect(() => {
    const symbolToFetch = alertToEdit?.stockSymbol ?? stockSymbol;
    if (!symbolToFetch) return;
    fetchStocks().then((stocks) => {
      const stock = stocks.find(
        (s) => s.symbol.trim() === String(symbolToFetch).trim(),
      );
      if (stock) {
        setCurrentStockPrice(stock.currentPrice);
      }
    });
  }, [alertToEdit, stockSymbol]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: alertToEditId ? t("edit-alert") : t("new-alert"),
      // headerLeft: () => (
      //   <HeaderButton onPress={() => router.back()}>
      //     <Feather name="x" size={22} color="#000" />
      //   </HeaderButton>
      // ),
      headerRight: () =>
        isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Pressable onPress={() => handleSubmit()} hitSlop={8}>
            <Feather name="check" size={22} color="#000" />
          </Pressable>
        ),
    });
  }, [navigation, alertToEditId, isLoading]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newAlert: AlertData = {
        id: alertToEditId ? Number(alertToEditId) : 0,
        uuid: alertToEditId ? String(alertToEdit?.uuid) : uuidv4(),
        devicePushToken: await getDevicePushToken(),
        stockSymbol: alertToEditId
          ? alertToEdit?.stockSymbol!
          : String(stockSymbol),
        alertType,
        stockTitle: alertToEditId
          ? alertToEdit?.stockTitle!
          : String(stockTitle),
        value: Number(alertThreshold.trim()),
        enabled,
        synced: false,
        notificationChannels: JSON.stringify(notificationChannels),
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (alertToEditId) {
        updateAlert(newAlert);
      } else {
        addAlert(newAlert);
        decreaseUserContraintCounts("maxAlerts");
      }
    } catch (error) {
      console.error("Error saving alert:", error);
      Alert.alert(
        t("error"),
        t("there-was-an-error-saving-the-alert-please-try-again"),
        [{ text: t("okay") }],
      );
    } finally {
      setIsLoading(false);
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View className="flex-1 bg-none px-6" style={{ paddingTop: headerHeight + 10 }}>
          <View className="rounded-2xl p-4 mb-5 border border-white/30 bg-gray-200/30 backdrop-blur-sm">
            <View className="flex-row items-center justify-between mb-0">
              <View>
                <Text className="text-[#171717] text-xl font-extrabold">
                  {alertToEdit?.stockSymbol ?? stockSymbol ?? "—"}
                </Text>
                <Text className="text-[#404040] text-base font-semibold mt-1" numberOfLines={2}>
                  {alertToEdit?.stockTitle ?? stockTitle ?? ""}
                </Text>
              </View>
              {currentStockPrice != null && (
                <Text className="text-[#171717] text-xl font-extrabold">
                  {currentStockPrice.toLocaleString()}{" "}
                  <Text className="text-[#a3a3a3] text-sm font-normal">FCFA</Text>
                </Text>
              )}
            </View>
          </View>

          <Text className="text-[15px] text-[#4b5563] mb-2">
            {t("alert-type")}
          </Text>
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setAlertType("above");
              }}
              className={`flex-1 aspect-square rounded-2xl items-center justify-center gap-2 overflow-hidden ${
                alertType === "above"
                  ? "bg-green-300/30 border-2 border-green-300/30 backdrop-blur-sm"
                  : " border border-white/30 bg-gray-200/30 backdrop-blur-sm"
              }`}
              style={
                alertType === "above"
                  ? { shadowColor: "#22c55e", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }
                  : undefined
              }
            >
              <Feather
                name="arrow-up"
                size={28}
                color={alertType === "above" ? "#fff" : "#6b7280"}
              />
              <Text
                className={`text-sm font-semibold ${
                  alertType === "above" ? "text-white" : "text-gray-500"
                }`}
              >
                {t("above")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setAlertType("below");
              }}
              className={`flex-1 aspect-square rounded-2xl items-center justify-center gap-2 overflow-hidden ${
                alertType === "below"
                  ? "bg-red-300/30 border-2 border-red-300/30 backdrop-blur-sm"
                  : "border border-white/30 bg-gray-200/30 backdrop-blur-sm"
              }`}
              style={
                alertType === "below"
                  ? { shadowColor: "#ef4444", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }
                  : undefined
              }
            >
              <Feather
                name="arrow-down"
                size={28}
                color={alertType === "below" ? "#fff" : "#6b7280"}
              />
              <Text
                className={`text-sm font-semibold ${
                  alertType === "below" ? "text-white" : "text-gray-500"
                }`}
              >
                {t("below")}
              </Text>
            </Pressable>
          </View>

          <Text className="text-[15px] text-[#4b5563] mb-2">
            {t("target-value")}
          </Text>
          <Pressable
            onPress={() => {
              Alert.prompt(
                t("target-value"),
                "",
                [
                  { text: t("cancel"), style: "cancel" },
                  {
                    text: t("save"),
                    isPreferred: true,
                    onPress: (value?: string) => {
                      if (value) setAlertThreshold(value);
                    },
                  },
                ],
                "plain-text",
                alertThreshold,
                "numeric",
              );
            }}
            className="border border-white/30 bg-gray-200/30 backdrop-blur-sm rounded-2xl py-4 items-center justify-center mb-4"
          >
            <Text className="text-2xl font-extrabold">
              {alertThreshold || "—"}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              {t("enter-target-value")}
            </Text>
          </Pressable>

          <View className="flex-row justify-between items-center my-4">
            <Text className="text-[15px] text-[#4b5563]">
              {t("enabled")}
            </Text>
            <Pressable
              onPress={() => setEnabled(!enabled)}
              className={`w-14 h-14 rounded-2xl items-center justify-center ${
                enabled ? "bg-black" : "border border-white/30 bg-gray-200/30 backdrop-blur-sm"
              }`}
              style={
                enabled
                  ? { elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 }
                  : undefined
              }
            >
              <Feather
                name={enabled ? "bell" : "bell-off"}
                size={22}
                color={enabled ? "#fff" : "#9ca3af"}
              />
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
