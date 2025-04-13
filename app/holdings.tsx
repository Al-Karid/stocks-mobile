import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Dialog from "react-native-dialog";
import HoldingListing from "@/components/holdings/HoldingListing";
import { Holding } from "@/types/portfolio";
import { router, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useStockDataService } from "@/data/useStockDataService";
import { provideHapticFeedback } from "@/utils/interactionUtils";

export default function SomeScreen() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();
  const { stocks } = useStockDataService();

  const stockOptions = [
    { label: "SIBC - Société Ivoirienne de Banque", value: "SIBC" },
    { label: "SOGB - Société Générale de Banques", value: "SOGB" },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 5, marginTop: 6 }}
          onPress={handleNewTransaction}
        >
          <FontAwesome name="pencil-square-o" size={23} color="#007AFF" />
        </Pressable>
      ),
    });

    const sampleHoldings: Holding[] = [
      {
        symbol: "SIBC",
        name: "Société Ivoirienne de Banque",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: 4000,
      },
      {
        symbol: "SOGB",
        name: "Société Générale de Banques",
        quantity: 5,
        averagePrice: 5000,
        currentPrice: 5200,
        gainLoss: -1000,
      },
    ];
    setHoldings(sampleHoldings);
  }, []);

  const handleNewTransaction = () => {
    setDialogVisible(true);
    provideHapticFeedback()
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleConfirm = () => {
    if (!selectedStock) {
      return;
    }
    setDialogVisible(false);
    router.push({
      pathname: "/add-transaction",
      params: { 
        symbol: selectedStock,
        title: stocks.find((stock) => stock.symbol.trim() === selectedStock.trim())?.title 
      },
    });
  };

  return (
    <>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Choisir une action</Dialog.Title>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStock}
            onValueChange={(itemValue) => setSelectedStock(itemValue)}
            style={{ width: "100%" }}
          >
            <Picker.Item label="-- Sélectionner --" value="" />
            {stocks.map((option) => (
              <Picker.Item
                key={option.id}
                label={option.title}
                value={option.symbol}
              />
            ))}
          </Picker>
        </View>

        <Dialog.Button label="Annuler" onPress={handleCancel} />
        <Dialog.Button label="Valider" onPress={handleConfirm} />
      </Dialog.Container>

      <HoldingListing holdings={holdings} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectButton: {
    margin: 16,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  selectText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
});
