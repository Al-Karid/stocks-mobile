import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { useAlertStore } from "@/stores/alertStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { getDevicePushToken } from "@/services/pushTokenService";
import { AlertData } from "@/types/alerts";
import { useTranslation } from "react-i18next";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

interface AlertFormSheetProps {
  stockSymbol: string | null;
  stockTitle: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const AlertFormSheet: React.FC<AlertFormSheetProps> = ({
  stockSymbol,
  stockTitle,
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "62%"], []);

  const { addAlert, notificationChannels } = useAlertStore();
  const { decreaseUserContraintCounts } = useSettingsStore();
  const { fetchStocks } = useStockRepository();

  const [currentStockPrice, setCurrentStockPrice] = useState<number | null>(null);
  const [alertType, setAlertType] = useState<"below" | "above">("above");
  const [alertThreshold, setAlertThreshold] = useState("2500");
  const [enabled, setEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!stockSymbol) return;
    fetchStocks().then((stocks) => {
      const stock = stocks.find(
        (s) => s.symbol.trim() === String(stockSymbol).trim()
      );
      if (stock) {
        setCurrentStockPrice(stock.currentPrice);
        setAlertThreshold(String(stock.currentPrice));
      }
    });
  }, [stockSymbol]);

  useEffect(() => {
    if (isVisible && stockSymbol) {
      const timeout = setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, stockSymbol]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const newAlert: AlertData = {
        id: 0,
        uuid: uuidv4(),
        devicePushToken: await getDevicePushToken(),
        stockSymbol: String(stockSymbol),
        alertType,
        stockTitle: String(stockTitle),
        value: Number(alertThreshold.trim()),
        enabled,
        synced: false,
        notificationChannels: JSON.stringify(notificationChannels),
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addAlert(newAlert);
      decreaseUserContraintCounts("maxAlerts");
      bottomSheetRef.current?.dismiss();
      onClose();
    } catch (error) {
      Alert.alert(
        t("error"),
        t("there-was-an-error-saving-the-alert-please-try-again"),
        [{ text: t("okay") }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderFooter = (props: any) => (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View className="flex-row gap-3 px-6 py-4 pb-10 bg-white border-t border-gray-100">
        <Pressable
          onPress={() => bottomSheetRef.current?.dismiss()}
          className="flex-1 bg-[#f3f4f6] py-4 rounded-2xl items-center"
        >
          <Text className="text-[#9ca3af] text-lg font-semibold">{t("cancel")}</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={isSaving}
          className="flex-1 bg-black py-4 rounded-2xl items-center"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">{t("save")}</Text>
          )}
        </Pressable>
      </View>
    </BottomSheetFooter>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={1}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableOverDrag={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      )}
      footerComponent={renderFooter}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stock info card */}
        <View className="rounded-2xl p-4 mb-5 border border-white bg-gray-200/30 backdrop-blur-sm">
          <View className="flex-row items-center justify-between mb-0">
            <View>
              <Text className="text-[#171717] text-xl font-extrabold">
                {stockSymbol ?? "—"}
              </Text>
              <Text className="text-[#404040] text-base font-semibold mt-1" numberOfLines={2}>
                {stockTitle ?? ""}
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

        {/* Alert type */}
        <Text className="text-[15px] text-[#4b5563] mb-2">{t("alert-type")}</Text>
        <View className="flex-row gap-3 mb-4">
          <Pressable
            onPress={() => setAlertType("above")}
            className={`flex-1 rounded-2xl items-center justify-center gap-2 overflow-hidden py-5 ${
              alertType === "above"
                ? "bg-green-500 border-2 border-green-500"
                : "bg-gray-100 border-2 border-transparent"
            }`}
          >
            <Feather name="trending-up" size={24} color={alertType === "above" ? "#fff" : "#6b7280"} />
            <Text className={`text-sm font-semibold ${alertType === "above" ? "text-white" : "text-gray-500"}`}>
              {t("above")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAlertType("below")}
            className={`flex-1 rounded-2xl items-center justify-center gap-2 overflow-hidden py-5 ${
              alertType === "below"
                ? "bg-red-500 border-2 border-red-500"
                : "bg-gray-100 border-2 border-transparent"
            }`}
          >
            <Feather name="trending-down" size={24} color={alertType === "below" ? "#fff" : "#6b7280"} />
            <Text className={`text-sm font-semibold ${alertType === "below" ? "text-white" : "text-gray-500"}`}>
              {t("below")}
            </Text>
          </Pressable>
        </View>

        {/* Target value */}
        <Text className="text-[15px] text-[#4b5563] mb-2">{t("target-value")}</Text>
        <View className="bg-black rounded-2xl py-4 px-5 mb-4 flex-row items-center">
          <BottomSheetTextInput
            className="flex-1 text-white text-2xl font-extrabold"
            placeholder="—"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={alertThreshold}
            onChangeText={setAlertThreshold}
            selectionColor="#ffffff"
          />
          <Text className="text-gray-400 text-xs ml-2">FCFA</Text>
        </View>

        {/* Enabled toggle */}
        <View className="flex-row justify-between items-center mt-2 mb-2">
          <Text className="text-[15px] text-[#4b5563]">{t("enabled")}</Text>
          <Pressable
            onPress={() => setEnabled(!enabled)}
            className={`w-14 h-14 rounded-2xl items-center justify-center ${
              enabled ? "bg-black" : "bg-gray-200"
            }`}
          >
            <Feather
              name={enabled ? "bell" : "bell-off"}
              size={22}
              color={enabled ? "#fff" : "#9ca3af"}
            />
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default AlertFormSheet;