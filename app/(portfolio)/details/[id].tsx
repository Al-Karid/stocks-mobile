import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PortfolioDetailsHeader from "@/components/portfolio/PortfolioDetailsHeader";
import PortfolioHolding from "@/components/portfolio/PortfolioHolding";

// Static dataset (Replace with API call later)
const portfolios: Portfolio[] = [
  {
    id: 1,
    updatedAt: null,
    userId: 1,
    name: "BRVM",
    holdings: [
      {
        id: 1,
        updatedAt: null,
        symbol: "CI0000000659",
        quantity: 48,
        averagePurchasePrice: 5580,
        currentPrice: 3700,
        performence: -33.69,
      },
      {
        id: 2,
        updatedAt: null,
        symbol: "CI0000000162",
        quantity: 219,
        averagePurchasePrice: 3690,
        currentPrice: 5280,
        performence: 43.09,
      },
    ],
  },
  {
    id: 2,
    updatedAt: null,
    userId: 1,
    name: "NASDAQ",
    holdings: [],
  },
];

export default function PortfolioDetail() {
  const { id } = useLocalSearchParams();
  const portfolioId = Number(id);

  const portfolio = portfolios.find((p) => p.id === portfolioId);

  return (
    <View style={styles.container}>
      {portfolio ? (
        <>
          {/* Portfolio Header */}
          <PortfolioDetailsHeader portfolio={portfolio} />

          {/* Holdings List */}
          {portfolio.holdings.length > 0 ? (
            <FlatList
              data={portfolio.holdings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PortfolioHolding item={item} />
              )}
            />
          ) : (
            <Text style={styles.noHoldings}>No holdings in this portfolio.</Text>
          )}
        </>
      ) : (
        <Text style={styles.notFound}>Portfolio not found!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  noHoldings: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  notFound: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});