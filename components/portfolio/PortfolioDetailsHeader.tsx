import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define the props for this component
interface PortfolioDetailsHeaderProps {
  portfolio: Portfolio;
}

export default function PortfolioDetailsHeader({ portfolio }: PortfolioDetailsHeaderProps) {
  return (
    <View style={styles.portfolioCard}>
      <Text style={styles.portfolioTitle}>{portfolio.name}</Text>
      {/* <Text style={styles.portfolioSubtitle}>Portfolio ID: {portfolio.id}</Text> */}
      <Text style={styles.portfolioSubtitle}>
        Total Holdings: {portfolio.holdings.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  portfolioCard: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  portfolioTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  portfolioSubtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
});