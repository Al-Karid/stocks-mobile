import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Transaction } from "@/types/portfolio";
import { formatNumber } from "@/utils/numberUtils";

const { width } = Dimensions.get("window");

interface Props {
  transaction: Transaction;
  symbol: string;
}

const formatTransactionNumber = (number: number) => {
  return formatNumber(Math.abs(number).toFixed(0));
}

const TransactionCard = ({ transaction, symbol }: Props) => {
  return (
    <View style={styles.card}>
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

      <View style={styles.detailRow}>
        <Text style={styles.label}>Quantity</Text>
        <Text style={styles.value}>{formatTransactionNumber(transaction.quantity)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Price/Share</Text>
        <Text style={styles.value}>{formatTransactionNumber(transaction.realPricePerShare)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Total Cost</Text>
        <Text style={styles.value}>{formatTransactionNumber(transaction.totalCost)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {new Date(transaction.transactionDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Fees</Text>
        <Text style={styles.value}>{transaction.fees}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
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
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransactionCard;
