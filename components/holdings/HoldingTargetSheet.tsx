import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HoldingTargetSheetProps {
  isVisible: boolean;
  onClose: () => void;
  portfolioId: number;
  symbol: string;
  name: string;
  currentPrice: number;
  existingTargetPrice: number | null;
  existingTargetDate: string | null;
}

const HoldingTargetSheet: React.FC<HoldingTargetSheetProps> = ({
  isVisible,
  onClose,
  portfolioId,
  symbol,
  name,
  currentPrice,
  existingTargetPrice,
  existingTargetDate,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["65%", "78%"], []);

  const { setHoldingTarget, getHoldings } = usePortfolioStore();

  const [averagePurchasePrice, setAveragePurchasePrice] = useState<number>(0);
  const [targetPrice, setTargetPrice] = useState<string>(
    existingTargetPrice != null ? existingTargetPrice.toString() : ""
  );
  const [targetDate, setTargetDate] = useState<Date>(
    existingTargetDate
      ? new Date(existingTargetDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const fetchAvgPrice = async () => {
      const holdingList = await getHoldings(portfolioId);
      const holding = holdingList.find((h) => h.symbol === symbol);
      if (holding) {
        setAveragePurchasePrice(holding.averagePrice ?? 0);
      }
    };
    fetchAvgPrice();
  }, [isVisible, portfolioId, symbol]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const targetPriceNum = targetPrice ? parseFloat(targetPrice) : null;
  const projectedReturn =
    targetPriceNum && averagePurchasePrice > 0
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
      portfolioId,
      symbol,
      targetPrice: priceNum && !isNaN(priceNum) ? priceNum : null,
      targetDate: dateStr,
    });
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  const handleClear = () => {
    Alert.alert(t("clear-target"), t("confirm-clear-target", { symbol }), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await setHoldingTarget({
            portfolioId,
            symbol,
            targetPrice: null,
            targetDate: null,
          });
          bottomSheetRef.current?.dismiss();
          onClose();
        },
      },
    ]);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderFooter = (props: any) => (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View className="flex-row justify-between items-center gap-3 px-6 py-4 bg-white border-t border-gray-100" style={{ paddingBottom: insets.bottom + 8 }}>
        {existingTargetPrice != null && (
          <TouchableOpacity
            className="w-12 h-12 rounded-full border border-[#FF3B30] items-center justify-center"
            onPress={handleClear}
          >
            <Feather name="trash-2" size={16} color="#FF3B30" />
          </TouchableOpacity>
        )}
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-[#007AFF] py-4 rounded-xl items-center"
        >
          <Text className="text-white font-extrabold text-base tracking-wide">{t("save")}</Text>
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
      >
        {/* Heading */}
        <View className="items-center mt-2 mb-6">
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
          <BottomSheetTextInput
            className="border border-gray-200 rounded-xl p-4 text-2xl font-bold text-gray-900 bg-gray-50 text-right"
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

        {/* Projection preview */}
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Feather
                name={
                  projectedReturn !== null
                    ? projectedReturn >= 0
                      ? "trending-up"
                      : "trending-down"
                    : "minus"
                }
                size={16}
                color={
                  projectedReturn !== null
                    ? projectedReturn >= 0
                      ? "#16a34a"
                      : "#dc2626"
                    : "#9ca3af"
                }
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
              {daysToTarget > 0 ? t("in-days", { count: daysToTarget }) : t("target-date")}
            </Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default HoldingTargetSheet;