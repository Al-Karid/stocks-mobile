import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Button, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioList from "@/components/PortfolioList";
import { HapticButton } from "@/components/HapticButton";

export default function Index() {
  
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: 1, updatedAt: null, userId: 1, name: "BRVM", holdings: [] },
    { id: 2, updatedAt: null, userId: 1, name: "NASDAQ", holdings: [] },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
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
    setModalVisible(false); // Close modal
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>Portfolio</Text>
        <HapticButton onPress={() => setModalVisible(true)}>
          <FontAwesome name="plus" size={18} color="#3D3D3D" />
        </HapticButton>
      </View>

      {/* Portfolio List */}
      <PortfolioList portfolios={portfolios} />

      {/* Modal for Adding Portfolio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>New Portfolio</Text>
            <TextInput
              placeholder="Enter portfolio name"
              value={portfolioName}
              onChangeText={setPortfolioName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
            <Button title="Save" onPress={handleSavePortfolio} />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ textAlign: "center", color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
