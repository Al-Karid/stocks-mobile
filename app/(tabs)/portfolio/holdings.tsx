import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  Platform,
  Modal,
} from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import HoldingListing from "@/components/holdings/HoldingListing";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Stock } from "@/types/stock";

export default function HoldingsScreen() {
  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { fetchStocks } = useStockRepository();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const { holdings, getHoldings, portfolios } = usePortfolioStore();
  const [selectedStock, setSelectedStock] = useState<string>("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isAndroidModalVisible, setAndroidModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 5, marginTop: 3 }}
          onPress={handleNewTransaction}
        >
          <Feather name="edit-3" size={19} color="#007AFF" />
        </Pressable>
      ),
    });

    getHoldings(Number(portfolioId));

    const fetchStocksData = async () => {
      const stocks = await fetchStocks();
      setStocks(stocks);
      const portfolio = portfolios.find((p) => p.id === Number(portfolioId));
      if (portfolio) {
        setPortfolioName(portfolio.name);
      }
    };
    fetchStocksData();
  }, []);

  const handleNewTransaction = () => {
    provideHapticFeedback();
    if (Platform.OS === "ios") {
      bottomSheetModalRef.current?.present();
    } else {
      setAndroidModalVisible(true);
    }
  };

  const handleCancel = () => {
    if (Platform.OS === "ios") {
      bottomSheetModalRef.current?.dismiss();
    } else {
      setAndroidModalVisible(false);
    }
    setSelectedStock("");
  };

  const handleConfirm = (symbol: string) => {
    if (!symbol) return;
    handleCancel();
    router.push({
      pathname: "/transactions/new",
      params: {
        portfolioId,
        symbol,
        title: stocks.find((stock) => stock.symbol.trim() === symbol.trim())?.title,
      },
    });
    setSelectedStock("");
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
        pressed && styles.stockItemPressed,
      ]}
    >
      <Text style={styles.stockItemText}>{item.title}</Text>
    </Pressable>
  );

  const renderSheetContent = () => (
    <>
      <Text style={styles.sheetTitle}>Sélectionner une action</Text>
      <Text style={styles.sheetSubtitle}>
        Sélectionnez pour enregistrer une transaction.
      </Text>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStockItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={{ marginTop: 16 }}>
        <Pressable onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <>
      {/* iOS Bottom Sheet */}
      {Platform.OS === "ios" && (
        <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={["50%"]}>
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {renderSheetContent()}
          </BottomSheetView>
        </BottomSheetModal>
      )}

      {/* Android Fullscreen Modal */}
      {Platform.OS === "android" && (
        <Modal
          visible={isAndroidModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={handleCancel}
        >
          <View style={{ flex: 1, padding: 20 }}>{renderSheetContent()}</View>
        </Modal>
      )}

      <HoldingListing
        holdings={holdings}
        portfolioName={portfolioName}
        onHoldingLongPress={handleHoldingLongPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
});
