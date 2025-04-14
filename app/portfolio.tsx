import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useNavigation } from "expo-router";

export default function Portfolio() {
  const navigation = useNavigation();
  const { portfolios: portfolioStore, fetchPortfolios, addPortfolio } = usePortfolioStore();

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

  useEffect(() => {
    fetchPortfolios();
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 5, marginTop: 6 }}
          onPress={handleOpenDialog}
        >
          <FontAwesome name="pencil-square-o" size={23} color="#007AFF" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ActionSheetProvider>
      <>
        {/* Portfolio List */}
        <PortfolioListing portfolios={portfolioStore} />
        {/* Add Portfolio Dialog */}
        <Dialog.Container visible={isAddVisible}>
          <Dialog.Title>
            <Text>Create Portfolio</Text>
          </Dialog.Title>
          <Dialog.Input
            placeholder="Enter portfolio name"
            value={portfolioName}
            onChangeText={setPortfolioName}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => handleCloseDialog(setAddVisible)}
          />
          <Dialog.Button
            label="Create"
            onPress={() => handleSavePortfolio(portfolioName)}
          />
        </Dialog.Container>
      </>
    </ActionSheetProvider>
  );
}