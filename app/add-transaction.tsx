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
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionType } from "@/types/portfolio";
import { useLocalSearchParams, router } from "expo-router";

export default function NewTransaction() {
  const { portfolioId, symbol, title } = useLocalSearchParams<{
    portfolioId?: string;
    symbol?: string;
    title?: string;
  }>();

  const [type, setType] = useState<TransactionType>("BUY");
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [quantity, setQuantity] = useState("");
  const [pricePerShare, setPricePerShare] = useState("");
  const [fees, setFees] = useState("1.2");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const priceInputRef = useRef<TextInput>(null);
  const feesInputRef = useRef<TextInput>(null);

  const parsedQuantity = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(pricePerShare) || 0;
  const parsedFees = parseFloat(fees) || 0;

  const subtotal = parsedQuantity * parsedPrice;
  const total = subtotal + subtotal * (parsedFees / 100);

  const handleSubmit = () => {
    const parsedQuantity = parseFloat(quantity);
    const parsedPrice = parseFloat(pricePerShare);
    const parsedFees = parseFloat(fees);

    if (isNaN(parsedQuantity) || isNaN(parsedPrice)) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir correctement les champs numériques."
      );
      return;
    }

    const newTransaction = {
      portfolioId: portfolioId ? parseInt(portfolioId) : undefined,
      symbol: symbol ?? "",
      type,
      transactionDate,
      quantity: parsedQuantity,
      pricePerShare: parsedPrice,
      fees: isNaN(parsedFees) ? 1.2 : parsedFees,
    };

    console.log("📤 Nouvelle transaction :", newTransaction);
    Alert.alert("✅ Succès", "Transaction enregistrée !");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {symbol && (
          <Text style={styles.sectionTitle}>
            {title ?? "Action"} ({symbol})
          </Text>
        )}

        <Text style={styles.label}>Type de transaction</Text>
        <View style={styles.typeSelector}>
          {(["BUY", "SELL"] as TransactionType[]).map((value) => (
            <Pressable
              key={value}
              style={[
                styles.typeButton,
                type === value && styles.typeButtonSelected,
              ]}
              onPress={() => setType(value)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === value && styles.typeButtonTextSelected,
                ]}
              >
                {value === "BUY" ? "Achat" : "Vente"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Date de la transaction</Text>
        <DateTimePicker
          value={transactionDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (date) setTransactionDate(date);
          }}
        />

        <Text style={styles.label}>Quantité</Text>
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
          placeholder="Ex: 100"
        />

        <Text style={styles.label}>Prix par action (FCFA)</Text>
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
          placeholder="Ex: 500"
        />

        <Text style={styles.label}>Frais de transaction</Text>
        <TextInput
        ref={feesInputRef}
          style={[styles.input, focusedField === "fees" && styles.inputFocused]}
          keyboardType="numeric"
          returnKeyType="done"
          value={fees}
          onChangeText={setFees}
          onFocus={() => setFocusedField("fees")}
          onBlur={() => setFocusedField(null)}
          placeholder="Par défaut 1.2"
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total estimé</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} FCFA</Text>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            Enregistrer la transaction
          </Text>
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
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  typeButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  typeButtonTextSelected: {
    color: "#fff",
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
});
