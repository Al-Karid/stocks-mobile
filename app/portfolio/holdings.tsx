import { useEffect, useState, useRef, useMemo } from "react";
import { View, StyleSheet, Platform, Pressable, Text, SafeAreaView, FlatList } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import HoldingListing from "@/components/holdings/HoldingListing";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Stock } from "@/types/stock";

export default function HoldingsScreen() {
  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { fetchStocks } = useStockRepository();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const { holdings, getHoldings } = usePortfolioStore();
  const [selectedStock, setSelectedStock] = useState<string>("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 5, marginTop: 3 }}
          onPress={handleNewTransaction}
        >
          <AntDesign name="addfile" size={19} color="#007AFF" />
        </Pressable>
      ),
    });

    getHoldings(Number(portfolioId));

    const fetchStocksData = async () => {
      const stocks = await fetchStocks();
      setStocks(stocks);
    };
    fetchStocksData();
  }, []);

  const handleNewTransaction = () => {
    bottomSheetModalRef.current?.present();
    provideHapticFeedback();
  };

  const handleCancel = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedStock("");
  };

  const handleConfirm = (symbol: string) => {
    if (!symbol) return;
    bottomSheetModalRef.current?.dismiss();
    router.push({
      pathname: "/transactions/new",
      params: {
        portfolioId,
        symbol,
        title: stocks.find((stock) => stock.symbol.trim() === symbol.trim())?.title
      },
    });
    setSelectedStock(""); // Reset after confirm
  };

  const handleHoldingLongPress = (symbol: string) => {
    provideHapticFeedback();
    router.push({
      pathname: "/transactions/history",
      params: {
        portfolioId,
        symbol,
        title: stocks.find((stock) => stock.symbol.trim() === symbol.trim())?.title,
      },
    });
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <Pressable
      onPress={() => handleConfirm(item.symbol)}
      style={({ pressed }) => [
        styles.stockItem,
        pressed && styles.stockItemPressed
      ]}
    >
      <Text style={styles.stockItemText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["50%"]}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
            Sélectionner une action
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            Sélectionnez pour enregistrer une transaction.
          </Text>
          <FlatList
            data={stocks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStockItem}
            contentContainerStyle={{ paddingBottom: 20}}
          />
          <View style={{ marginTop: 16 }}>
            <Pressable onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <HoldingListing holdings={holdings} onHoldingLongPress={(symbol) => handleHoldingLongPress(symbol)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stockItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  stockItemPressed: {
    backgroundColor: "#f0f0f0",
  },
  stockItemText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
