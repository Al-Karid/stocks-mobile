import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { TransactionType } from "@/types/portfolio";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useConputeService } from "@/services/computeService";
import { formatNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";
import TransactionTypeSelector from "@/components/transactions/TransactionTypeSelector";
import StockHeroCard from "@/components/stocks/StockHeroCard";
import { Stock } from "@/types/stock";

interface NewTransactionSheetProps {
  symbol: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const NewTransactionSheet: React.FC<NewTransactionSheetProps> = ({
  symbol,
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);
  const priceInputRef = useRef<any>(null);

  const { addTransaction, portfolios } = usePortfolioStore();
  const { findStock } = useStockRepository();
  const { computeRealPricePerShare, computeTotalCost } = useConputeService();

  const defaultPortfolio = portfolios.find((p) => p.isDefault);
  const [stock, setStock] = useState<Stock | null>(null);
  const [stockTitle, setStockTitle] = useState<string>("");
  const [type, setType] = useState<TransactionType>("BUY");
  const [quantity, setQuantity] = useState("10");
  const [pricePerShare, setPricePerShare] = useState("1000");
  const [isSaving, setIsSaving] = useState(false);

  const parsedQuantity = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(pricePerShare) || 0;
  const total = parsedQuantity * parsedPrice;

  useEffect(() => {
    if (!symbol) return;
    findStock(symbol.trim()).then((data) => {
      if (data) {
        setStock(data);
        setStockTitle(data.title);
        setPricePerShare(String(data.currentPrice));
      }
    });
  }, [symbol]);

  useEffect(() => {
    if (isVisible && symbol) {
      const timeout = setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, symbol]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const parsedQuantity = parseFloat(quantity);
      const parsedPrice = parseFloat(pricePerShare);
      const realPricePerShare = computeRealPricePerShare(parsedPrice, 0);

      if (isNaN(parsedQuantity) || isNaN(parsedPrice)) {
        throw new Error(t("please-enter-a-valid-input"));
      }

      if (parsedQuantity <= 0) {
        throw new Error(t("quantity-must-be-higher-than-0"));
      }

      if (!defaultPortfolio) {
        throw new Error(t("no-portfolio-available"));
      }

      const newTransaction = {
        portfolioId: defaultPortfolio.id,
        symbol: symbol ?? "",
        type: type,
        name: stockTitle,
        transactionDate: new Date(),
        quantity: type === "BUY" ? parsedQuantity : -parsedQuantity,
        pricePerShare: type === "BUY" ? parsedPrice : -parsedPrice,
        realPricePerShare: type === "BUY" ? realPricePerShare : -realPricePerShare,
        totalCost: type === "BUY"
          ? computeTotalCost(parsedQuantity, realPricePerShare)
          : -computeTotalCost(parsedQuantity, realPricePerShare),
        fees: 0,
        notes: null,
      };

      await addTransaction(newTransaction);
      bottomSheetRef.current?.dismiss();
      onClose();
    } catch (error: any) {
      Alert.alert(
        t("error"),
        error.message || t("an-error-has-accured-while-saving-the-transaction")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderFooter = (props: any) => (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View className="flex-row gap-3 px-6 py-4 pb-10 bg-white border-t border-gray-100">
        <Pressable
          onPress={() => bottomSheetRef.current?.dismiss()}
          className="flex-1 bg-[#f3f4f6] py-4 rounded-2xl items-center"
        >
          <Text className="text-[#9ca3af] text-lg font-semibold">{t("cancel")}</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={isSaving}
          className="flex-1 bg-black py-4 rounded-2xl items-center"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">{t("save")}</Text>
          )}
        </Pressable>
      </View>
    </BottomSheetFooter>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={1}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableOverDrag={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      )}
      footerComponent={renderFooter}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* StockHeroCard as header */}
        <StockHeroCard stock={stock} />

        <View className="gap-4 mt-4">
          {/* Transaction type */}
          <Text className="text-[15px] text-[#4b5563] mb-2">{t("transaction-type")}</Text>
          <View className="flex-row gap-3 mb-4">
            <TransactionTypeSelector type={type} onSelect={setType} price={stock?.currentPrice} />
          </View>

          {/* Quantity & Price inline */}
          <Text className="text-[15px] text-[#4b5563] mb-2">{t("quantity")} & {t("price-per-share-fcfa")}</Text>
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-black rounded-2xl py-4 px-5 flex-row items-center">
              <BottomSheetTextInput
                className="flex-1 text-white text-2xl font-extrabold"
                placeholder="10"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                returnKeyType="next"
                onSubmitEditing={() => priceInputRef.current?.focus()}
                selectionColor="#ffffff"
              />
            </View>
            <View className="flex-1 bg-black rounded-2xl py-4 px-5 flex-row items-center">
              <BottomSheetTextInput
                ref={priceInputRef}
                className="flex-1 text-white text-2xl font-extrabold"
                placeholder="1000"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={pricePerShare}
                onChangeText={setPricePerShare}
                returnKeyType="done"
                selectionColor="#ffffff"
              />
              <Text className="text-gray-400 text-xs ml-2">FCFA</Text>
            </View>
          </View>

          {/* Total estimated */}
          <View className="bg-white rounded-2xl py-4 px-5 border border-gray-200 items-center">
            <Text className="text-sm text-gray-500">{t("total-estimated")}</Text>
            <Text className="text-2xl font-extrabold text-black mt-1">
              {formatNumber(total.toFixed(2))} FCFA
            </Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default NewTransactionSheet;