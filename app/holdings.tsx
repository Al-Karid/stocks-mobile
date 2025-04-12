import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
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
          <FontAwesome name="pencil-square-o" size={23} color="#007AFF" />
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
    //navigation.navigate("transaction/new");
  };

  return <HoldingListing holdings={holdings} />;
}
