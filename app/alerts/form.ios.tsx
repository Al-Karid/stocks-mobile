import { AlertData } from "@/types/alerts";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import { useAlertStore } from "@/stores/alertStore";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
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
      headerLeft: () => (
        <HeaderButton onPress={() => router.back()}>
          <Feather name="x" size={22} color="#000" />
        </HeaderButton>
      ),
      headerRight: () =>
        isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <HeaderButton onPress={() => handleSubmit()}>
            <Feather name="check" size={22} color="#000" />
          </HeaderButton>
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
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        >
          <View className="bg-[#f5f5f5] rounded-2xl p-5 mb-5">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 rounded-full bg-[#d4d4d4] items-center justify-center">
                  <Text className="text-[#525252] text-xs font-bold">
                    {((alertToEdit?.stockSymbol ?? stockSymbol) || "").slice(0, 2)}
                  </Text>
                </View>
                <Text className="text-[#171717] text-lg font-bold">
                  {alertToEdit?.stockSymbol ?? stockSymbol ?? "—"}
                </Text>
              </View>
              {currentStockPrice != null && (
                <Text className="text-[#171717] text-lg font-bold">
                  {currentStockPrice.toLocaleString()}{" "}
                  <Text className="text-[#a3a3a3] text-sm font-normal">FCFA</Text>
                </Text>
              )}
            </View>
            <Text className="text-[#737373] text-xs">
              {alertToEdit?.stockTitle ?? stockTitle ?? ""}
            </Text>
          </View>

          <Text className="text-[15px] text-[#4b5563] mb-2">
            {t("alert-type")}
          </Text>
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => setAlertType("above")}
              className={`flex-1 aspect-square rounded-2xl items-center justify-center gap-2 overflow-hidden ${
                alertType === "above"
                  ? "bg-green-500 border-2 border-green-500"
                  : "bg-gray-100 border-2 border-transparent"
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
              onPress={() => setAlertType("below")}
              className={`flex-1 aspect-square rounded-2xl items-center justify-center gap-2 overflow-hidden ${
                alertType === "below"
                  ? "bg-red-500 border-2 border-red-500"
                  : "bg-gray-100 border-2 border-transparent"
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
            className="bg-black rounded-2xl py-4 items-center justify-center mb-4"
            style={{ elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 }}
          >
            <Text className="text-white text-2xl font-extrabold">
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
                enabled ? "bg-black" : "bg-gray-200"
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
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
