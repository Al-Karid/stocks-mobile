import React, { useRef, useState } from "react";
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
import { useHeaderHeight } from "@react-navigation/elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionType } from "@/types/portfolio";
import { useLocalSearchParams, router } from "expo-router";
import { useConputeService } from "@/services/computeService";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { formatNumber } from "@/utils/numberUtils";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import TransactionTypeSelector from "@/components/transactions/TransactionTypeSelector";

export default function NewTransaction() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();

  const { portfolioId, symbol, title } = useLocalSearchParams<{
    portfolioId?: string;
    symbol?: string;
    title?: string;
  }>();

  const { computeRealPricePerShare, computeTotalCost } = useConputeService();
  const { addTransaction } = usePortfolioStore();

  const [type, setType] = useState<TransactionType>("BUY");
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [quantity, setQuantity] = useState("10");
  const [pricePerShare, setPricePerShare] = useState("1000");
  const [fees, setFees] = useState("1.51");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const priceInputRef = useRef<TextInput>(null);
  const feesInputRef = useRef<TextInput>(null);

  const parsedQuantity = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(pricePerShare) || 0;
  const parsedFees = parseFloat(fees) || 0;

  const subtotal = parsedQuantity * parsedPrice;
  const total = subtotal + subtotal * (parsedFees / 100);

  const setCleanFees = (value: string) => {
    const parsedValue = value.replace(",", ".");
    setFees(parsedValue);
  };

  const handleSubmit = async () => {
    try {
      const parsedQuantity = parseFloat(quantity);
      const parsedPrice = parseFloat(pricePerShare);
      const parsedFees = parseFloat(fees);
      const realPricePerShare = computeRealPricePerShare(
        parsedPrice,
        parsedFees,
      );

      if (isNaN(parsedQuantity) || isNaN(parsedPrice) || isNaN(parsedFees)) {
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
        fees: isNaN(parsedFees) ? 1.51 : parsedFees,
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
    }
  };

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
          <TransactionTypeSelector type={type} onSelect={setType} />
        </View>

        <Text style={styles.label}>{t("transaction-date")}</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            {transactionDate.toLocaleDateString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={transactionDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (event.type === "set" && date) {
                setTransactionDate(date);
              }
            }}
          />
        )}

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
          onSubmitEditing={() => feesInputRef.current?.focus()}
        />

        <Text style={styles.label}>{t("transaction-fees")}</Text>
        <TextInput
          ref={feesInputRef}
          style={[styles.input, focusedField === "fees" && styles.inputFocused]}
          keyboardType="numeric"
          returnKeyType="done"
          value={fees}
          onChangeText={setCleanFees}
          onFocus={() => setFocusedField("fees")}
          onBlur={() => setFocusedField(null)}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t("total-estimated")}</Text>
          <Text style={styles.totalValue}>
            {formatNumber(total.toFixed(2))} FCFA
          </Text>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t("save-transaction")}</Text>
        </Pressable>
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
    color: "#007AFF",
    textAlign: "center",
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 15,
    color: "#555", // soft gray instead of full black
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
    borderColor: "#007AFF",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
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
    backgroundColor: "#e9fce8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b6e2b3",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  totalValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: "#388E3C",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});
