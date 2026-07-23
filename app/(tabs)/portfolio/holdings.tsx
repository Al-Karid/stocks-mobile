import { useEffect, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HoldingListing from "@/components/holdings/HoldingListing";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Stock } from "@/types/stock";
import { useTranslation } from "react-i18next";
import StockSelector, { StockSelectorRef } from "@/components/shared/StockSelector";
import NewTransactionSheet from "@/components/transactions/NewTransactionSheet";

export default function HoldingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const stockSelectorRef = useRef<StockSelectorRef>(null);

  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();

  const { holdings, getHoldings, portfolios, setHoldingTarget } = usePortfolioStore();

  const [selectedTransactionStock, setSelectedTransactionStock] = useState<{ symbol: string; title: string } | null>(null);

  useEffect(() => {
    getHoldings(Number(portfolioId));

    const portfolio = portfolios.find((p) => p.id === Number(portfolioId));
    if (portfolio) {
      navigation.setOptions({ title: portfolio.name });
    }
  }, []);

  const handleNewTransaction = () => {
    provideHapticFeedback();
    stockSelectorRef.current?.open();
  };

  const handleStockSelect = (stock: Stock) => {
    // Show transaction sheet instead of navigating
    setSelectedTransactionStock({ symbol: stock.symbol, title: stock.title });
  };

  const handleHoldingLongPress = (symbol: string) => {
    provideHapticFeedback();
    const holding = holdings.find((h) => h.symbol === symbol);
    router.push({
      pathname: "/transactions/history",
      params: {
        portfolioId,
        symbol,
        title: holding?.name ?? symbol,
      },
    });
  };

  return (
    <View className="flex-1">
      <HoldingListing
        holdings={holdings}
        onHoldingLongPress={handleHoldingLongPress}
        onSaveTarget={setHoldingTarget}
      />

      <StockSelector
        ref={stockSelectorRef}
        onSelectStock={handleStockSelect}
      />

      {/* Transaction sheet */}
      <NewTransactionSheet
        symbol={selectedTransactionStock?.symbol ?? null}
        isVisible={selectedTransactionStock !== null}
        onClose={() => setSelectedTransactionStock(null)}
      />

      {/* New Transaction FAB */}
      <Pressable
        onPress={handleNewTransaction}
        className="absolute bg-black w-14 h-14 rounded-full items-center justify-center"
        style={{
          right: 20,
          bottom: insets.bottom + 90,
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}