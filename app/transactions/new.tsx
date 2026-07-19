import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionType } from "@/types/portfolio";
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
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [quantity, setQuantity] = useState("10");
  const [pricePerShare, setPricePerShare] = useState("1000");
  const [currentStockPrice, setCurrentStockPrice] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const priceInputRef = useRef<TextInput>(null);

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: Platform.select({ ios: headerHeight + 20 }) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {symbol && (
          <Text style={styles.sectionTitle}>
            {title ?? t("stock")} ({symbol})
          </Text>
        )}

        <Text style={styles.label}>{t("transaction-type")}</Text>
        <View style={styles.typeSelector}>
          <TransactionTypeSelector type={type} onSelect={setType} price={currentStockPrice} />
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>{t("quantity")}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "quantity" && styles.inputFocused,
              ]}
              keyboardType="numeric"
              returnKeyType="done"
              value={quantity}
              onChangeText={setQuantity}
              onFocus={() => setFocusedField("quantity")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={() => priceInputRef.current?.focus()}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>{t("price-per-share-fcfa")}</Text>
            <TextInput
              ref={priceInputRef}
              style={[
                styles.input,
                focusedField === "pricePerShare" && styles.inputFocused,
              ]}
              keyboardType="numeric"
              returnKeyType="done"
              value={pricePerShare}
              onChangeText={setPricePerShare}
              onFocus={() => setFocusedField("pricePerShare")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t("total-estimated")}</Text>
          <Text style={styles.totalValue}>
            {formatNumber(total.toFixed(2))} FCFA
          </Text>
        </View>

        {Platform.OS !== "ios" && (
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{t("save-transaction")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
    textAlign: "center",
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 15,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#000",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 20,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  totalValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});