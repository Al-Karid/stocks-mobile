import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HoldingListing from "@/components/holdings/HoldingListing";
import { Holding } from "@/types/portfolio";
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function SomeScreen() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const navigation = useNavigation();

  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 5, marginTop: 6 }}
          onPress={handleNewTransaction}
        >
          <FontAwesome
            name="pencil-square-o"
            size={25}
            color="#007AFF"
          />
        </TouchableOpacity>
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
        symbol: "TTLC1",
        name: "Total Côte d'Ivoire",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: -4000,
      },
      {
        symbol: "TTLC2",
        name: "Total Côte d'Ivoire",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: -4000,
      },
      {
        symbol: "TTLC3",
        name: "Total Côte d'Ivoire",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: -4000,
      },
      {
        symbol: "TTLC4",
        name: "Total Côte d'Ivoire",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: -4000,
      },
      {
        symbol: "TTLC5",
        name: "Total Côte d'Ivoire",
        quantity: 10,
        averagePrice: 3000,
        currentPrice: 3400,
        gainLoss: -4000,
      },
    ];
    setHoldings(sampleHoldings);
  }, []);

  const handleNewTransaction = () => {
    //navigation.navigate("transaction/new"); // à adapter selon ton routing
  };

  return (
    // <View style={styles.container}>
    //   {/* <View style={styles.header}>
    //     <Text style={styles.title}>Portefeuille</Text>
    //     <TouchableOpacity style={styles.button} onPress={handleNewTransaction}>
    //       <Text style={styles.buttonText}>+ Nouvelle transaction</Text>
    //     </TouchableOpacity>
    //   </View> */}

    // </View>
      <HoldingListing holdings={holdings} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: "#F5F7F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});