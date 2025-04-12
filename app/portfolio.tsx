import React, { useState } from "react";
import Dialog from "react-native-dialog";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";

export default function Index() {
  const { portfolios: portfolioStore, addPortfolio } = usePortfolioStore();

  const [portfolioName, setPortfolioName] = useState("");
  const [isAddVisible, setAddVisible] = useState(false);

  const handleOpenDialog = () => {
    provideHapticFeedback();
    setAddVisible(true);
  };

  // Function to handle adding a new portfolio
  const handleSavePortfolio = (name: string) => {
    if (portfolioName.trim() === "") {
      alert("Please enter a portfolio name.");
      return;
    }
    addPortfolio(portfolioName);
    setPortfolioName("");
    setAddVisible(false);
  };

  return (
    <ActionSheetProvider>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Portfolio</Text>
            <Text style={styles.newPortfolio} onPress={handleOpenDialog}>
              <FontAwesome
                name="plus"
                size={18}
                color="#123456"
                style={{ fontSize: 18 }}
              >
                {" "}
                New
              </FontAwesome>
            </Text>
          </View>

          {/* Portfolio List */}
          <PortfolioListing portfolios={portfolioStore} />
        </View>

        {/* Add Portfolio Dialog */}
        <Dialog.Container visible={isAddVisible}>
          <Dialog.Title>Create Portfolio</Dialog.Title>
          <Dialog.Input
            placeholder="Enter portfolio name"
            value={portfolioName}
            onChangeText={setPortfolioName}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => handleCloseDialog(setAddVisible)}
          />
          <Dialog.Button label="Create" onPress={() => handleSavePortfolio(portfolioName)} />
        </Dialog.Container>
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
  newPortfolio: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
});
