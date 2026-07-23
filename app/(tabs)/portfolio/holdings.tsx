import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import HoldingListing from "@/components/holdings/HoldingListing";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Stock } from "@/types/stock";
import { useTranslation } from "react-i18next";
import StockSelector, {
  StockSelectorRef,
} from "@/components/shared/StockSelector";
import NewTransactionSheet from "@/components/transactions/NewTransactionSheet";
import StockDetailsSheet from "@/components/stocks/StockDetailsSheet";
import Fab from "@/components/buttons/Fab";

export default function HoldingsScreen() {
  const { t } = useTranslation();
  const stockSelectorRef = useRef<StockSelectorRef>(null);

  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();

  const { holdings, getHoldings, portfolios, setHoldingTarget } =
    usePortfolioStore();

  const [selectedTransactionStock, setSelectedTransactionStock] = useState<{
    symbol: string;
    title: string;
  } | null>(null);
  const [stockDetailsSymbol, setStockDetailsSymbol] = useState<string | null>(null);

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
    setStockDetailsSymbol(symbol);
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

        {/* Stock details sheet on long press */}
        <StockDetailsSheet
          symbol={stockDetailsSymbol}
          isVisible={stockDetailsSymbol !== null}
          onClose={() => setStockDetailsSymbol(null)}
        />

        {/* New Transaction FAB */}
        <Fab icon="plus" onPress={handleNewTransaction} />
      </View>
  );
}
