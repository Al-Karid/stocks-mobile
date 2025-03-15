import PortfolioList from "@/components/PortfolioList";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { HapticButton } from "@/components/HapticButton";

export default function Index() {
  const handleAddPortfolio = () => {
    // Logic to add a new portfolio goes here
    console.log("Add new portfolio");
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
    </View>
  );
}