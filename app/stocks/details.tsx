import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { Feather } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";
import StockHeroCard from "@/components/stocks/StockHeroCard";

export default function StocksDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { symbol } = useLocalSearchParams();
  const { addStockToWatchlist, removeStockFromWatchlist } =
    useWatchlistStore();
  const { findStock } = useStockRepository();
  const { userContraintCounts, decreaseUserContraintCounts, increaseUserContraintCounts } =
    useSettingsStore();

  const [watchlisted, setWatchlisted] = useState(false);
  const [stock, setStock] = useState<Stock | null>(null);

  const fetchStockData = async () => {
    const data = await findStock(symbol as string);
    setStock(data);
    setWatchlisted(data?.isInWatchlist ?? false);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const isPositive = (stock?.percentageChange ?? 0) > 0;
  const isNegative = (stock?.percentageChange ?? 0) < 0;

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

  return (
    <ScrollView className="flex-1 bg-[#f2f2f2]" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      {/* Hero card */}
      <StockHeroCard stock={stock} />

      <View className="gap-4 mt-4">
        {/* Price details card */}
        <View className="rounded-2xl px-5 py-4 border border-white bg-white gap-3">
          <DetailRow
            label={t("current-price")}
            value={formatCurrency(stock?.currentPrice || 0)}
          />
          <View className="h-px bg-gray-100" />
          <DetailRow
            label={t("previous-close")}
            value={formatCurrency(stock?.previousClosePrice || 0)}
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
                {formatPercentage(stock?.percentageChange ?? 0, 2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Market data card */}
        <View className="rounded-2xl px-5 py-4 border border-white bg-white gap-3">
          <DetailRow
            label={t("volume-titles")}
            value={stock?.volumeTitles ? String(stock.volumeTitles) : "N/A"}
          />
          <View className="h-px bg-gray-100" />
          <DetailRow
            label={t("volume")}
            value={stock?.volumeValues ? formatCurrency(stock.volumeValues) : "N/A"}
          />
          <View className="h-px bg-gray-100" />
          <DetailRow
            label={t("opening-price")}
            value={stock?.opening ? formatCurrency(stock.opening) : "N/A"}
          />
          <View className="h-px bg-gray-100" />
          <DetailRow
            label={t("high")}
            value={stock?.high ? formatCurrency(stock.high) : "N/A"}
          />
          <View className="h-px bg-gray-100" />
          <DetailRow
            label={t("low")}
            value={stock?.low ? formatCurrency(stock.low) : "N/A"}
          />
          <View className="h-px bg-gray-100" />
          {stock?.rsi != null && (
            <DetailRow
              label={t("rsi")}
              value={stock.rsi.toFixed(2)}
            />
          )}
        </View>

        {/* Action buttons */}
        <View className="flex-row justify-evenly mt-2">
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
            onPress={() =>
              router.push({
                pathname: "/transactions/new",
                params: { symbol: stock?.symbol },
              })
            }
          />
          <ActionButton
            icon={<Feather name="bell" size={20} color="#123458" />}
            label={t("alerts")}
            onPress={() =>
              router.push({
                pathname: "/alerts/form",
                params: { symbol: stock?.symbol, title: stock?.title },
              })
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

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