import PortfolioList from "@/components/PortfolioList";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { HapticButton } from "@/components/HapticButton";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");

  const handleAddPortfolio = () => {
    setModalVisible(true);
  };

  const handleSavePortfolio = () => {
    console.log("New portfolio added:", portfolioName);
    setModalVisible(false);
    setPortfolioName(""); // Reset input field
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>Portfolio</Text>
        <HapticButton onPress={handleAddPortfolio}>
          <FontAwesome name="plus" size={18} color="#3D3D3D" />
        </HapticButton>
      </View>

      <PortfolioList />

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
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 }}
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
