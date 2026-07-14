import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useHeaderHeight, HeaderButton } from "@react-navigation/elements";
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
  const headerHeight = useHeaderHeight();
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
  const [transactionDate, setTransactionDate] = useState(new Date());
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
        //FIX manage the case when portfolioId is undefined
        //FIX manage the case when symbol is undefined
        portfolioId: parseInt(portfolioId!),
        symbol: symbol ?? "",
        type: type,
        name: title ?? "",
        transactionDate: transactionDate,
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
    transactionDate,
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
        <HeaderButton onPress={handleSubmit}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Feather name="check" size={20} color="#000" />
          )}
        </HeaderButton>
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
    <ScrollView
      // className="flex-1"
      contentContainerStyle={[
        styles.container,
        { paddingTop: headerHeight + 20, paddingBottom: 0 },
      ]}
    >
      {symbol && (
        <Text style={styles.sectionTitle}>
          {title ?? t("stock")} ({symbol})
        </Text>
      )}

      <Text style={styles.label}>{t("transaction-type")}</Text>
      <View style={styles.typeSelector}>
        <TransactionTypeSelector
          type={type}
          onSelect={setType}
          price={currentStockPrice}
        />
      </View>

      <Text style={styles.label}>{t("details")}</Text>

      <View style={styles.row}>
        <Pressable
          style={[
            styles.valueButton,
            quantity ? styles.valueButtonSet : styles.valueButtonEmpty,
          ]}
          onPress={() => {
            Alert.prompt(
              t("quantity"),
              "",
              [
                { text: t("cancel"), style: "cancel" },
                {
                  text: t("save"),
                  isPreferred: true,
                  onPress: (value?: string) => {
                    if (value) setQuantity(value);
                  },
                },
              ],
              "plain-text",
              quantity,
              "numeric",
            );
          }}
        >
          <Text style={styles.valueButtonLabel}>{t("quantity")}</Text>
          <Text
            style={[
              styles.valueButtonText,
              quantity
                ? styles.valueButtonTextSet
                : styles.valueButtonTextEmpty,
            ]}
          >
            {quantity || "—"}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.valueButton,
            pricePerShare ? styles.valueButtonSet : styles.valueButtonEmpty,
          ]}
          onPress={() => {
            Alert.prompt(
              t("price-per-share-fcfa"),
              "",
              [
                { text: t("cancel"), style: "cancel" },
                {
                  text: t("save"),
                  isPreferred: true,
                  onPress: (value?: string) => {
                    if (value) setPricePerShare(value);
                  },
                },
              ],
              "plain-text",
              pricePerShare,
              "numeric",
            );
          }}
        >
          <Text style={styles.valueButtonLabel}>
            {t("price-per-share-fcfa")}
          </Text>
          <Text
            style={[
              styles.valueButtonText,
              pricePerShare
                ? styles.valueButtonTextSet
                : styles.valueButtonTextEmpty,
            ]}
          >
            {pricePerShare || "—"}
          </Text>
        </Pressable>
      </View>

      <View className="bg-black items-center mx-auto mt-10 rounded-xl">
        <View className="flex-row items-center justify-between py-7 px-6 w-full">
          <View className="flex-row items-center gap-3">
            <Feather name="dollar-sign" size={22} color="#fff" />
            <Text className="text-[17px] text-white font-semibold">
              {t("total-estimated")}
            </Text>
          </View>
          <Text className="text-[26px] font-black text-white">
            {formatNumber(total.toFixed(2))} FCFA
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
    // textAlign: "center",
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 15,
    color: "#555",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  valueButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  valueButtonSet: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  valueButtonEmpty: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
  },
  valueButtonLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    marginBottom: 6,
  },
  valueButtonText: {
    fontSize: 24,
    fontWeight: "700",
  },
  valueButtonTextSet: {
    color: "#fff",
  },
  valueButtonTextEmpty: {
    color: "#000",
  },
});
