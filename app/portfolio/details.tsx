import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { formatCurrency, formatPercentage, formatTransactionNumber } from "@/utils/numberUtils";
import { Holding } from "@/types/portfolio";
import { globalCardStyles, globalTextStyles } from "@/styles/globalStyles";

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

      <View style={globalCardStyles.card}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={globalTextStyles.labelValueDetailsContainerBTop}>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>Total value</Text>
            <Text style={globalTextStyles.value}>{formatCurrency(portfolio.performance.totalValue)}</Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>Total cost</Text>
            <Text style={globalTextStyles.value}>{formatCurrency(portfolio.performance.totalCost)}</Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>Total gain/loss</Text>
            <Text
              style={[
                globalTextStyles.value,
                { color: portfolio.performance.totalGainLoss >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              {formatCurrency(portfolio.performance.totalGainLoss)}
            </Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>Total gain/loss rate</Text>
            <Text
              style={[
                globalTextStyles.value,
                { color: portfolio.performance.gainLossPercentage >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              {formatPercentage(portfolio.performance.gainLossPercentage, 2)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.holdingSectionTitle}>Holdings</Text>

      {holdings.map((holding) => (
        <View key={holding.symbol} style={globalCardStyles.card}>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
            <Text style={styles.holdingName}>{holding.name}</Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsContainer}>
            <View style={globalTextStyles.labelValueDetailsRow}>
              <Text style={globalTextStyles.label}>Quantity</Text>
              <Text style={globalTextStyles.value}>{formatTransactionNumber(holding.quantity)}</Text>
            </View>
            <View style={globalTextStyles.labelValueDetailsRow}>
              <Text style={globalTextStyles.label}>Gain/Loss</Text>
              <Text
                style={[
                  globalTextStyles.value,
                  { color: holding.gainLoss >= 0 ? "#34C759" : "#FF3B30" },
                ]}
              >
                {formatCurrency(holding.gainLoss)}
              </Text>
            </View>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
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
  holdingSymbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  holdingName: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default PortfolioDetails;
