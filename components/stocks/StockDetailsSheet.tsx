import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { Feather } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";
import StockHeroCard from "@/components/stocks/StockHeroCard";
import AlertFormSheet from "@/components/alerts/AlertFormSheet";
import NewTransactionSheet from "@/components/transactions/NewTransactionSheet";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface StockDetailsSheetProps {
  symbol: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const StockDetailsSheet: React.FC<StockDetailsSheetProps> = ({ symbol, isVisible, onClose }) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "81%"], []);
  const insets = useSafeAreaInsets()

  const { findStock } = useStockRepository();
  const { addStockToWatchlist, removeStockFromWatchlist } = useWatchlistStore();
  const { userContraintCounts, decreaseUserContraintCounts, increaseUserContraintCounts } =
    useSettingsStore();

  const [watchlisted, setWatchlisted] = useState(false);
  const [stock, setStock] = useState<Stock | null>(null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    findStock(symbol).then((data) => {
      setStock(data);
      setWatchlisted(data?.isInWatchlist ?? false);
    });
  }, [symbol]);

  useEffect(() => {
    if (isVisible && symbol) {
      const timeout = setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, symbol]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const handleToggleWatchlist = () => {
    if (watchlisted) {
      removeStockFromWatchlist(stock?.symbol ?? "");
      increaseUserContraintCounts("maxWatchlist");
    } else {
      addStockToWatchlist(stock?.symbol ?? "");
      decreaseUserContraintCounts("maxWatchlist");
    }
    setWatchlisted(!watchlisted);
  };

  const watchlistFull = userContraintCounts.maxWatchlist <= 0 && !watchlisted;

  const handleOpenTransactionSheet = () => {
    bottomSheetRef.current?.dismiss();
    setTimeout(() => {
      setShowTransactionForm(true);
    }, 500);
  };

  const handleCloseTransactionSheet = () => {
    setShowTransactionForm(false);
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 500);
  };

  const handleOpenAlertForm = () => {
    bottomSheetRef.current?.dismiss();
    setTimeout(() => {
      setShowAlertForm(true);
    }, 500);
  };

  const handleCloseAlertForm = () => {
    setShowAlertForm(false);
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 500);
  };

  const isPositive = (stock?.percentageChange ?? 0) > 0;
  const isNegative = (stock?.percentageChange ?? 0) < 0;

  const renderFooter = (props: any) => (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View className="flex-row justify-evenly px-6 py-4 pb-10 bg-white border-t border-gray-100" style={{paddingBottom: insets.bottom}}>
        <ActionButton
          icon={
            <Feather
              name={watchlisted ? "bookmark" : "bookmark"}
              size={20}
              color={watchlisted ? "#FF3B30" : "#123458"}
            />
          }
          label={t("watchlist")}
          onPress={handleToggleWatchlist}
          disabled={watchlistFull}
        />
        <ActionButton
          icon={<Feather name="briefcase" size={20} color="#123458" />}
          label={t("portfolio")}
          onPress={handleOpenTransactionSheet}
        />
        <ActionButton
          icon={<Feather name="bell" size={20} color="#123458" />}
          label={t("alerts")}
          onPress={handleOpenAlertForm}
        />
      </View>
    </BottomSheetFooter>
  );

  if (!stock) return null;

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableOverDrag={false}
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
        >
          {/* Hero card */}
          <StockHeroCard stock={stock} />

          <View className="gap-4 mt-4">
            {/* Price details card */}
            <View className="rounded-2xl px-5 py-4 border border-gray-200 bg-white gap-3">
              <DetailRow
                label={t("current-price")}
                value={formatCurrency(stock.currentPrice || 0)}
              />
              <View className="h-px bg-gray-100" />
              <DetailRow
                label={t("previous-close")}
                value={formatCurrency(stock.previousClosePrice || 0)}
              />
              <View className="h-px bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-[#a3a3a3]">{t("change-rate")}</Text>
                <View className="flex-row items-center gap-1">
                  <Feather
                    name={
                      isPositive
                        ? "arrow-up-right"
                        : isNegative
                        ? "arrow-down-right"
                        : "minus"
                    }
                    size={14}
                    color={isPositive ? "#16a34a" : isNegative ? "#dc2626" : "#6b7280"}
                  />
                  <Text
                    className={`text-sm font-semibold ${
                      isPositive
                        ? "text-green-600"
                        : isNegative
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {formatPercentage(stock.percentageChange ?? 0, 2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Market data card */}
            <View className="rounded-2xl px-5 py-4 border border-gray-200 bg-white gap-3">
              <DetailRow
                label={t("volume-titles")}
                value={stock.volumeTitles ? String(stock.volumeTitles) : "N/A"}
              />
              <View className="h-px bg-gray-100" />
              <DetailRow
                label={t("volume")}
                value={stock.volumeValues ? formatCurrency(stock.volumeValues) : "N/A"}
              />
              <View className="h-px bg-gray-100" />
              <DetailRow
                label={t("opening-price")}
                value={stock.opening ? formatCurrency(stock.opening) : "N/A"}
              />
              <View className="h-px bg-gray-100" />
              <DetailRow
                label={t("high")}
                value={stock.high ? formatCurrency(stock.high) : "N/A"}
              />
              <View className="h-px bg-gray-100" />
              <DetailRow
                label={t("low")}
                value={stock.low ? formatCurrency(stock.low) : "N/A"}
              />
              <View className="h-px bg-gray-100" />
              {stock.rsi != null && (
                <DetailRow
                  label={t("rsi")}
                  value={stock.rsi.toFixed(2)}
                />
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Alert form sheet overlay */}
      <AlertFormSheet
        stockSymbol={stock.symbol}
        stockTitle={stock.title}
        isVisible={showAlertForm}
        onClose={handleCloseAlertForm}
      />

      {/* Transaction form sheet overlay */}
      <NewTransactionSheet
        symbol={stock.symbol}
        isVisible={showTransactionForm}
        onClose={handleCloseTransactionSheet}
      />
    </>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-800">{value}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      className="items-center gap-2"
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center border border-gray-200 ${
          disabled ? "bg-gray-100 opacity-50" : "bg-white"
        }`}
      >
        {icon}
      </View>
      <Text className={`text-[11px] font-medium ${disabled ? "text-gray-400" : "text-[#123458]"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default StockDetailsSheet;