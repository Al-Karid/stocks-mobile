import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { formatCurrency, formatPercentage, formatTransactionNumber } from "@/utils/numberUtils";
import { Holding } from "@/types/portfolio";

const { width } = Dimensions.get("window");

const PortfolioDetails = () => {
  const { portfolioId } = useLocalSearchParams();
  const { portfolios, getHoldings } = usePortfolioStore();
  const [holdings, setHoldings] = useState<Holding[]>([]);

  const portfolio = portfolios.find((p) => p.id === Number(portfolioId));

  useEffect(() => {
    const fetchHoldings = async () => {
      const data = await getHoldings(Number(portfolioId));
      setHoldings(data);
    };
    fetchHoldings();
  }, [portfolioId]);

  if (!portfolio) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Portfolio not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{portfolio.name.toLocaleUpperCase()}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Total Value</Text>
          <Text style={styles.value}>{formatCurrency(portfolio.performance.totalValue)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Total Cost</Text>
          <Text style={styles.value}>{formatCurrency(portfolio.performance.totalCost)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Total Gain/Loss</Text>
          <Text
            style={[
              styles.value,
              { color: portfolio.performance.totalGainLoss >= 0 ? "#34C759" : "#FF3B30" },
            ]}
          >
            {formatCurrency(portfolio.performance.totalGainLoss)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Gain/Loss %</Text>
          <Text
            style={[
              styles.value,
              { color: portfolio.performance.gainLossPercentage >= 0 ? "#34C759" : "#FF3B30" },
            ]}
          >
            {formatPercentage(portfolio.performance.gainLossPercentage, 2)}
          </Text>
        </View>
      </View>

      <Text style={styles.holdingSectionTitle}>Holdings</Text>

      {holdings.map((holding) => (
        <View key={holding.symbol} style={styles.holdingCard}>
          <View style={styles.holdingHeader}>
            <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
            <Text style={styles.holdingName}>{holding.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>{formatTransactionNumber(holding.quantity)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Gain/Loss</Text>
            <Text
              style={[
                styles.value,
                { color: holding.gainLoss >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              {formatCurrency(holding.gainLoss)}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F1F3F6",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F3F6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  holdingSectionTitle: {
    fontSize: 13,
    color: "gray",
    paddingLeft: 4,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  card: {
    width: width * 0.92,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  holdingCard: {
    width: width * 0.92,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  holdingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  holdingSymbol: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  holdingName: {
    fontSize: 16,
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default PortfolioDetails;
