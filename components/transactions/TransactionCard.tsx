import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Transaction } from "@/types/portfolio";
import { formatTransactionCurrency, formatTransactionNumber } from "@/utils/numberUtils";
import { globalTextStyles, globalCardStyles } from "@/styles/globalStyles";

const { width } = Dimensions.get("window");

interface Props {
  transaction: Transaction;
  symbol: string;
}

const TransactionCard = ({ transaction, symbol }: Props) => {
  return (
    <View style={globalCardStyles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: transaction.type === "BUY" ? "#34C759" : "#FF3B30" },
          ]}
        >
          <Text style={styles.typeText}>{transaction.type}</Text>
        </View>
      </View>

      <View style={globalTextStyles.labelValueDetailsContainerBTop}>

        <View style={globalTextStyles.labelValueDetailsRow}>
          <Text style={globalTextStyles.label}>Quantity</Text>
          <Text style={globalTextStyles.value}>{formatTransactionNumber(transaction.quantity)}</Text>
        </View>

        <View style={globalTextStyles.labelValueDetailsRow}>
          <Text style={globalTextStyles.label}>Price per share</Text>
          <Text style={globalTextStyles.value}>{formatTransactionCurrency(transaction.realPricePerShare)}</Text>
        </View>

        <View style={globalTextStyles.labelValueDetailsRow}>
          <Text style={globalTextStyles.label}>Total cost</Text>
          <Text style={globalTextStyles.value}>{formatTransactionCurrency(transaction.totalCost)}</Text>
        </View>

        <View style={globalTextStyles.labelValueDetailsRow}>
          <Text style={globalTextStyles.label}>Date</Text>
          <Text style={globalTextStyles.value}>
            {new Date(transaction.transactionDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={globalTextStyles.labelValueDetailsRow}>
          <Text style={globalTextStyles.label}>Fees</Text>
          <Text style={globalTextStyles.value}>{transaction.fees}%</Text>
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  symbol: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "700",
    opacity: 0.0,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  typeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    color: "#AAA",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#547792",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransactionCard;
