import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { usePortfolioStore } from "@/stores/portfolioStore";

export default function TargetPriceScreen() {
  const { t } = useTranslation();
  const {
    portfolioId,
    symbol,
    name,
    currentPrice: currentPriceStr,
    targetPrice: existingTargetStr,
    targetDate: existingDateStr,
  } = useLocalSearchParams<{
    portfolioId: string;
    symbol: string;
    name: string;
    currentPrice: string;
    targetPrice?: string;
    targetDate?: string;
  }>();

  const { setHoldingTarget, getHoldings } = usePortfolioStore();

  const currentPrice = parseFloat(currentPriceStr || "0");
  const existingTarget = existingTargetStr ? parseFloat(existingTargetStr) : null;

  const [averagePurchasePrice, setAveragePurchasePrice] = useState<number>(0);
  const [targetPrice, setTargetPrice] = useState<string>(
    existingTarget != null ? existingTarget.toString() : ""
  );
  const [targetDate, setTargetDate] = useState<Date>(
    existingDateStr ? new Date(existingDateStr) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchAvgPrice = async () => {
      const holdingList = await getHoldings(parseInt(portfolioId));
      const holding = holdingList.find((h) => h.symbol === symbol);
      if (holding) {
        setAveragePurchasePrice(holding.averagePrice ?? 0);
      }
    };
    fetchAvgPrice();
  }, [portfolioId, symbol]);

  const targetPriceNum = targetPrice ? parseFloat(targetPrice) : null;
  const projectedReturn = targetPriceNum && averagePurchasePrice > 0
    ? ((targetPriceNum - averagePurchasePrice) / averagePurchasePrice) * 100
    : null;

  const daysToTarget = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  const handleSave = async () => {
    const priceNum = targetPrice ? parseFloat(targetPrice) : null;
    const dateStr = targetDate ? targetDate.toISOString() : null;
    await setHoldingTarget({
      portfolioId: parseInt(portfolioId),
      symbol,
      targetPrice: priceNum && !isNaN(priceNum) ? priceNum : null,
      targetDate: dateStr,
    });
    router.back();
  };

  const handleClear = () => {
    Alert.alert(
      t("clear-target"),
      t("confirm-clear-target", { symbol }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            await setHoldingTarget({
              portfolioId: parseInt(portfolioId),
              symbol,
              targetPrice: null,
              targetDate: null,
            });
            router.back();
          },
        },
      ]
    );
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-none px-6" style={{ paddingBottom: Platform.OS === "ios" ? 40 : 24 }}>
        {/* Heading */}
        <View className="items-center mt-6 mb-6">
          <View className="bg-[#e8f0fe] rounded-full w-14 h-14 justify-center items-center mb-3">
            <Feather name="target" size={26} color="#007AFF" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">{name}</Text>
          <Text className="text-base text-gray-400 mt-1 font-medium">{symbol}</Text>
        </View>

        {/* Average purchase price (CMP) info */}
        <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
          <Text className="text-sm font-medium text-gray-500">{t("buy-price")}</Text>
          <Text className="text-lg font-bold text-gray-800">
            {formatCurrency(averagePurchasePrice, 0)}
          </Text>
        </View>

        {/* Current price info */}
        <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
          <Text className="text-sm font-medium text-gray-500">{t("current-price")}</Text>
          <Text className="text-lg font-bold text-gray-800">
            {formatCurrency(currentPrice, 0)}
          </Text>
        </View>

        {/* Target price input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-600 mb-2">{t("target-price")}</Text>
          <TextInput
            className="border border-gray-200 rounded-xl p-4 text-2xl font-bold text-gray-900 bg-gray-50 text-end"
            value={targetPrice}
            onChangeText={setTargetPrice}
            placeholder={formatCurrency(averagePurchasePrice || currentPrice, 0)}
            placeholderTextColor="#d1d5db"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Target date picker */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-600 mb-2">{t("target-date")}</Text>
          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={targetDate}
              mode="date"
              display="compact"
              minimumDate={new Date()}
              onChange={handleDateChange}
              style={{ alignSelf: "flex-start" }}
            />
          ) : (
            <>
              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3 bg-gray-50"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-base text-gray-800">{formatDisplayDate(targetDate)}</Text>
                <Feather name="calendar" size={18} color="#007AFF" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={targetDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
        </View>

        {/* Projection preview — always visible */}
        <View className="bg-gray-100 rounded-xl p-4 mb-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Feather
                name={projectedReturn !== null ? (projectedReturn >= 0 ? "trending-up" : "trending-down") : "minus"}
                size={16}
                color={projectedReturn !== null ? (projectedReturn >= 0 ? "#16a34a" : "#dc2626") : "#9ca3af"}
              />
              <Text className="text-sm font-semibold text-gray-500">{t("projected-return")}</Text>
            </View>
            {projectedReturn !== null ? (
              <Text
                className="text-lg font-extrabold"
                style={{ color: projectedReturn >= 0 ? "#16a34a" : "#dc2626" }}
              >
                {formatPercentage(projectedReturn, 2)}
              </Text>
            ) : (
              <Text className="text-lg font-bold text-gray-300">—</Text>
            )}
          </View>
          <View className="flex-row items-center gap-1.5 mt-2 pt-2 border-t border-gray-200">
            <Feather name="calendar" size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-400">
              {daysToTarget > 0
                ? t("in-days", { count: daysToTarget })
                : t("target-date")}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View className="flex-row justify-between items-center gap-3">
          {existingTarget != null && (
            <TouchableOpacity
              className="flex-row items-center gap-1.5 py-3 px-3 rounded-full border border-[#FF3B30]"
              onPress={handleClear}
            >
              <Feather name="trash-2" size={16} color="#FF3B30" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex-1 bg-[#007AFF] py-4 rounded-xl items-center"
            onPress={handleSave}
          >
            <Text className="text-white font-extrabold text-base tracking-wide">{t("save")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}