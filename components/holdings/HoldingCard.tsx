// components/HoldingCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Holding } from "@/types/portfolio";
import { FontAwesome } from "@expo/vector-icons";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";

interface Props {
  holding: Holding;
  onLongPress: () => void;
}

export default function HoldingCard({ holding, onLongPress }: Props) {
  const {
    symbol,
    name,
    quantity,
    averagePrice,
    currentPrice,
    gainLoss,
    totalCost,
  } = holding;

  const computedTotalCost = totalCost ?? quantity * averagePrice;
  const currentValue = quantity * currentPrice!;
  const isGain = gainLoss >= 0;
  const gainLossPercentage = ((currentPrice! - averagePrice) / averagePrice) * 100;

  return (
    <TouchableOpacity onLongPress={() => onLongPress()} activeOpacity={0.4}>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.symbol}>{symbol.trim()}</Text>
          </View>
          <View style={styles.priceStatus}>
            <FontAwesome
              name={isGain ? "arrow-up" : "arrow-down"}
              size={18}
              color={isGain ? "#22c55e" : "#ef4444"}
            />
            <Text
              style={[
                styles.gainLossValue,
                { color: isGain ? "#22c55e" : "#ef4444" },
              ]}
            >
              {formatPercentage(gainLossPercentage, 2)} ({formatCurrency(gainLoss, 0)})
            </Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Quantité</Text>
            <Text style={styles.value}>{formatCurrency(quantity)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CMP</Text>
            <Text style={styles.value}>{formatCurrency(Number(averagePrice.toFixed(0)))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cours</Text>
            <Text style={styles.value}>{formatCurrency(Number(currentPrice!.toFixed(0)))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Coût total</Text>
            <Text style={styles.value}>{formatCurrency(computedTotalCost.toFixed(0))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valeur actuelle</Text>
            <Text style={styles.value}>{formatCurrency(currentValue.toFixed(0))}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#123456",
  },
  name: {
    color: "#6b7280",
    fontSize: 10,
    fontStyle: "normal",
    marginTop: 0,
  },
  priceStatus: {
    alignItems: "flex-end",
  },
  gainLossValue: {
    marginTop: 4,
    fontWeight: "600",
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#374151",
    fontSize: 14,
  },
  value: {
    fontWeight: "600",
    color: "#123456",
  },
});