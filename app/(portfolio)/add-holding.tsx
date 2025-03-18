import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";

export default function AddHolding() {
  const router = useRouter();
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [averagePrice, setAveragePrice] = useState("");

  // Sample Stock Symbols (Replace with API data later)
  const stockSymbols = [
    { label: "CI0000000659 - Société A", value: "CI0000000659" },
    { label: "CI0000000162 - Société B", value: "CI0000000162" },
    { label: "CI0000001234 - Société C", value: "CI0000001234" },
  ];

  const handleSaveHolding = () => {
    console.log("Saving holding:", { symbol, quantity, averagePrice });
    // Add logic to save the holding
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Holding</Text>

      {/* Stock Symbol Dropdown */}
      <RNPickerSelect
        placeholder={{ label: "Select a Stock Symbol", value: null }}
        onValueChange={(value) => setSymbol(value)}
        items={stockSymbols}
        value={symbol}
        style={pickerSelectStyles}
      />

      {/* Quantity Input */}
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Average Purchase Price Input */}
      <TextInput
        placeholder="Average Purchase Price"
        value={averagePrice}
        onChangeText={setAveragePrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Save Holding" onPress={handleSaveHolding} />

      {/* Cancel Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "red",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 10,
  },
};
