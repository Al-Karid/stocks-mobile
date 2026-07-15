import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
      <View className="px-5 pt-5 pb-16 gap-4">
        {/* ── Hero card ── */}
        <View className="rounded-2xl px-5 py-6 items-center border border-gray-100">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {stock?.symbol}
          </Text>
          <Text className="text-base font-bold text-[#123458] text-center mb-4">
            {stock?.title}
          </Text>

          <Text className="text-4xl font-extrabold text-[#123458] mb-2">
            {formatCurrency(stock?.currentPrice || 0)}
          </Text>

          <View
            className={`flex-row items-center px-3 py-1.5 rounded-full ${
              isPositive
                ? "bg-green-500"
                : isNegative
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
          >
            <Feather
              name={
                isPositive
                  ? "arrow-up-right"
                  : isNegative
                  ? "arrow-down-right"
                  : "minus"
              }
              size={14}
              color="white"
            />
            <Text className="text-white text-sm font-bold ml-1">
              {formatPercentage(stock?.percentageChange ?? 0, 2)}
            </Text>
            <Text className="text-white/80 text-xs ml-1">
              ({formatCurrency((stock?.currentPrice ?? 0) - (stock?.previousClosePrice ?? 0))})
            </Text>
          </View>
        </View>

        {/* ── Price details card ── */}
        <View className="rounded-2xl px-5 py-4 border border-gray-100 gap-3">
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
            <Text className="text-sm text-gray-400">{t("change-rate")}</Text>
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

        {/* ── Market data card ── */}
        <View className="rounded-2xl px-5 py-4 border border-gray-100 gap-3">
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
        </View>

        {/* ── Action buttons ── */}
        <View className="flex-row justify-evenly mt-1">
          <ActionButton
            icon={
              <Ionicons
                name={watchlisted ? "bookmark" : "bookmark-outline"}
                size={22}
                color={watchlisted ? "#FF3B30" : "#123458"}
              />
            }
            label={watchlisted ? t("remove-from-watchlist") : t("add-to-watchlist")}
            onPress={handleToggleWatchlist}
            disabled={watchlistFull}
          />
          <ActionButton
            icon={<Ionicons name="briefcase-outline" size={22} color="#123458" />}
            label={t("add-to-portfolio")}
            onPress={() =>
              router.push({
                pathname: "/transactions/new",
                params: { symbol: stock?.symbol },
              })
            }
          />
          <ActionButton
            icon={<Ionicons name="notifications-outline" size={22} color="#123458" />}
            label={t("add-an-alert")}
            onPress={() =>
              router.push({
                pathname: "/alerts/form",
                params: { symbol: stock?.symbol },
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
      <Text className="text-sm text-gray-400">{label}</Text>
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
        className={`w-14 h-14 rounded-full items-center justify-center border border-gray-200 ${
          disabled ? "bg-gray-100 opacity-50" : "bg-white"
        }`}
      >
        {icon}
      </View>
      <Text
        className={`text-[11px] font-medium text-center leading-tight ${
          disabled ? "text-gray-400" : "text-[#123458]"
        }`}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
