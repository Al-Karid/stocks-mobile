// components/StockCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native";

interface StockCardProps {
  name: string;
  symbol: string;
  currentPrice: number;
  previousClosePrice: number;
  percentageChange: number;
}

const StockCard: React.FC<StockCardProps> = ({ name, symbol, currentPrice, previousClosePrice, percentageChange }) => {
  const isPositive = percentageChange >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.symbol}>{symbol.trim()}</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.label}>
          C: <Text style={styles.value}>{currentPrice}</Text> {"  "}
          V: <Text style={styles.value}>{previousClosePrice}</Text>
        </Text>
      </View>

      <View style={[styles.percentageContainer, isPositive ? styles.positive : styles.negative]}>
        {isPositive ? <ArrowUpRight color="white" size={20} /> : <ArrowDownRight color="white" size={20} />}
        <Text style={styles.percentageText}>{percentageChange.toFixed(2)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#123458",
    fontSize: 10,
    marginBottom: 8,
  },
  symbol: {
    fontWeight: "bold",
    color: "#123458",
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    color: "#333",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginLeft: 6,
  },
  positive: {
    backgroundColor: "#4CAF50",
  },
  negative: {
    backgroundColor: "#F44336",
  },
});

export default StockCard;