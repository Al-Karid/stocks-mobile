import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionType } from "@/types/portfolio";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useConputeService } from "@/services/computeService";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { formatNumber } from "@/utils/numberUtils";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import TransactionTypeSelector from "@/components/transactions/TransactionTypeSelector";

export default function NewTransaction() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 44;
  const navigation = useNavigation();

  const { portfolioId, symbol, title } = useLocalSearchParams<{
    portfolioId?: string;
    symbol?: string;
    title?: string;
  }>();

  const { computeRealPricePerShare, computeTotalCost } = useConputeService();
  const { addTransaction } = usePortfolioStore();
  const { fetchStocks } = useStockRepository();

  const [type, setType] = useState<TransactionType>("BUY");
  const [quantity, setQuantity] = useState("10");
  const [pricePerShare, setPricePerShare] = useState("1000");
  const [isSaving, setIsSaving] = useState(false);
  const [currentStockPrice, setCurrentStockPrice] = useState<number>(0);

  const parsedQuantity = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(pricePerShare) || 0;
  const total = parsedQuantity * parsedPrice;

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      const parsedQuantity = parseFloat(quantity);
      const parsedPrice = parseFloat(pricePerShare);
      const realPricePerShare = computeRealPricePerShare(parsedPrice, 0);

      if (isNaN(parsedQuantity) || isNaN(parsedPrice)) {
        throw new Error(t("please-enter-a-valid-input"));
      }
      if (parsedQuantity <= 0) {
        throw new Error(t("quantity-must-be-higher-than-0"));
      }

      const newTransaction = {
        portfolioId: parseInt(portfolioId!),
        symbol: symbol ?? "",
        type: type,
        name: title ?? "",
        transactionDate: new Date(),
        quantity: type === "BUY" ? parsedQuantity : -parsedQuantity,
        pricePerShare: type === "BUY" ? parsedPrice : -parsedPrice,
        realPricePerShare:
          type === "BUY" ? realPricePerShare : -realPricePerShare,
        totalCost:
          type === "BUY"
            ? computeTotalCost(parsedQuantity, realPricePerShare)
            : -computeTotalCost(parsedQuantity, realPricePerShare),
        fees: 0,
        notes: null,
      };

      await addTransaction(newTransaction);
      Toast.show({
        type: "success",
        text1: t("success"),
        text2: t("transaction-saved"),
        position: "bottom",
      });
      router.back();
    } catch (error: any) {
      Alert.alert(
        t("error"),
        error.message || t("an-error-has-accured-while-saving-the-transaction"),
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    quantity,
    pricePerShare,
    type,
    symbol,
    title,
    portfolioId,
    t,
    computeRealPricePerShare,
    computeTotalCost,
    addTransaction,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSubmit} hitSlop={8}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#1a1a1a" />
          ) : (
            <Feather name="check" size={20} color="#1a1a1a" />
          )}
        </Pressable>
      ),
    });
  }, [navigation, isSaving, handleSubmit]);

  useEffect(() => {
    if (!symbol) return;
    fetchStocks().then((stocks) => {
      const stock = stocks.find(
        (s) => s.symbol.trim() === String(symbol).trim(),
      );
      if (stock) {
        setCurrentStockPrice(stock.currentPrice);
        setPricePerShare(String(stock.currentPrice));
      }
    });
  }, [symbol]);

  return (
    <View className="flex-1 px-5 backdrop-blur-sm" style={{ paddingTop: headerHeight }}>
      {/* Stock info heading */}
      {symbol && (
        <View className="rounded-2xl p-4 mb-2 border border-white bg-gray-200/30 backdrop-blur-sm">
          <Text className="text-black text-xl font-extrabold">{symbol}</Text>
          {title && (
            <Text className="text-[#404040] text-sm mt-0.5" numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>
      )}

      {/* Transaction type */}
      <Text className="text-[15px] text-black mb-2 mt-2">{t("transaction-type")}</Text>
      <View className="flex-row gap-3 mb-2">
        <TransactionTypeSelector type={type} onSelect={setType} price={currentStockPrice} />
      </View>

      {/* Details label */}
      <Text className="text-[15px] text-black mb-2 mt-4">{t("details")}</Text>

      {/* Quantity + Price buttons */}
      <View className="flex-row gap-3">
        <Pressable
          className={`flex-1 aspect-square rounded-2xl items-center justify-center p-3 border border-white backdrop-blur-sm ${
            quantity ? "" : "bg-gray-200/30"
          }`}
          onPress={() => {
            Alert.prompt(
              t("quantity"), "",
              [
                { text: t("cancel"), style: "cancel" },
                { text: t("save"), isPreferred: true, onPress: (value?: string) => { if (value) setQuantity(value); } },
              ],
              "plain-text", quantity, "numeric",
            );
          }}
        >
          <Text className="text-[13px] font-medium text-[#404040] mb-1.5">{t("quantity")}</Text>
          <Text className="text-2xl font-bold text-black">
            {quantity || "—"}
          </Text>
        </Pressable>

        <Pressable
          className={`flex-1 aspect-square rounded-2xl items-center justify-center p-3 border border-white backdrop-blur-sm ${
            pricePerShare ? "" : "bg-gray-200/30"
          }`}
          onPress={() => {
            Alert.prompt(
              t("price-per-share-fcfa"), "",
              [
                { text: t("cancel"), style: "cancel" },
                { text: t("save"), isPreferred: true, onPress: (value?: string) => { if (value) setPricePerShare(value); } },
              ],
              "plain-text", pricePerShare, "numeric",
            );
          }}
        >
          <Text className="text-[13px] font-medium text-[#404040] mb-1.5">{t("price-per-share-fcfa")}</Text>
          <Text className="text-2xl font-bold text-black">
            {pricePerShare || "—"}
          </Text>
        </Pressable>
      </View>

      {/* Total estimated */}
      <View className="border border-white backdrop-blur-sm rounded-3xl w-full mt-5">
        <View className="flex-row items-center justify-between py-7 px-6">
          <View className="flex-row items-center gap-3">
            <Feather name="dollar-sign" size={22} color="#1a1a1a" />
            <Text className="text-[17px] text-black font-semibold">{t("total-estimated")}</Text>
          </View>
          <Text className="text-[26px] font-black text-black">
            {formatNumber(total.toFixed(2))} FCFA
          </Text>
        </View>
      </View>
    </View>
  );
}