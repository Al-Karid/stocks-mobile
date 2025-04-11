import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { HapticButton } from "@/components/HapticButton";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function Index() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: 1, updatedAt: null, userId: 1, name: "BRVM", holdings: [] },
    { id: 2, updatedAt: null, userId: 1, name: "NASDAQ", holdings: [] },
  ]);

  const [portfolioName, setPortfolioName] = useState("");

  // Function to handle adding a new portfolio
  const handleSavePortfolio = () => {
    if (portfolioName.trim() === "") return; // Prevent empty names

    const newPortfolio = {
      id: portfolios.length + 1, // Generate a new ID (should ideally come from DB)
      updatedAt: new Date().toISOString(),
      userId: 1,
      name: portfolioName.trim(),
      holdings: [],
    };

    setPortfolios([...portfolios, newPortfolio]); // Update state with new portfolio
    setPortfolioName(""); // Reset input field
  };

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
          <HapticButton onPress={() => {}}>
            <FontAwesome name="plus" size={22} color="#123456" />
          </HapticButton>
        </View>

        {/* Portfolio List */}
        <PortfolioListing portfolios={portfolios} />
      </View>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#123456",
  },
});
