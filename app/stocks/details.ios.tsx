import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { Feather } from "@expo/vector-icons";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";
import { Host, Button, HStack } from "@expo/ui/swift-ui";
import { buttonStyle, buttonBorderShape, controlSize, labelStyle, disabled as disabledModifier } from "@expo/ui/swift-ui/modifiers";

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
    <View className="flex-1 px-5 pt-5 pb-16 gap-4">
        {/* ── Hero card ── */}
        <View className="rounded-3xl px-5 py-6 items-center border border-white bg-gray-200/30 backdrop-blur-sm">
          <Text className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-widest mb-1">
            {stock?.symbol}
          </Text>
          <Text className="text-base font-bold text-[#171717] text-center mb-4">
            {stock?.title}
          </Text>

          <Text className="text-4xl font-extrabold text-[#171717] mb-2">
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
        <View className="rounded-2xl px-5 py-4 border border-white bg-gray-200/30 backdrop-blur-sm gap-3">
          <DetailRow
            label={t("current-price")}
            value={formatCurrency(stock?.currentPrice || 0)}
          />
          <View className="h-px bg-white/20" />
          <DetailRow
            label={t("previous-close")}
            value={formatCurrency(stock?.previousClosePrice || 0)}
          />
          <View className="h-px bg-white/20" />
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

        {/* ── Market data card ── */}
        <View className="rounded-2xl px-5 py-4 border border-white bg-gray-200/30 backdrop-blur-sm gap-3">
          <DetailRow
            label={t("volume-titles")}
            value={stock?.volumeTitles ? String(stock.volumeTitles) : "N/A"}
          />
          <View className="h-px bg-white/20" />
          <DetailRow
            label={t("volume")}
            value={stock?.volumeValues ? formatCurrency(stock.volumeValues) : "N/A"}
          />
          <View className="h-px bg-white/20" />
          <DetailRow
            label={t("opening-price")}
            value={stock?.opening ? formatCurrency(stock.opening) : "N/A"}
          />
          <View className="h-px bg-white/20" />
          <DetailRow
            label={t("high")}
            value={stock?.high ? formatCurrency(stock.high) : "N/A"}
          />
          <View className="h-px bg-white/20" />
          <DetailRow
            label={t("low")}
            value={stock?.low ? formatCurrency(stock.low) : "N/A"}
          />
        </View>

        {/* ── Action buttons ── */}
        <Host matchContents style={{alignSelf: "center"}}>
          <HStack spacing={8}>
            <Button
              label="Watchlist"
              systemImage={watchlisted ? "bookmark.fill" : "bookmark"}
              role={watchlisted ? "destructive" : "default"}
              modifiers={[
                buttonStyle("glass"),
                buttonBorderShape("circle"),
                controlSize("extraLarge"),
                labelStyle("iconOnly"),
                ...(watchlistFull ? [disabledModifier()] : []),
              ]}
              onPress={handleToggleWatchlist}
            />
            <Button
              label={t("portfolio")}
              systemImage="briefcase"
              modifiers={[
                buttonStyle("glass"),
                buttonBorderShape("circle"),
                controlSize("extraLarge"),
                labelStyle("iconOnly"),
              ]}
              onPress={() =>
                router.push({
                  pathname: "/transactions/new",
                  params: { symbol: stock?.symbol },
                })
              }
            />
            <Button
              label={t("alerts")}
              systemImage="bell"
              modifiers={[
                buttonStyle("glass"),
                buttonBorderShape("circle"),
                controlSize("extraLarge"),
                labelStyle("iconOnly"),
              ]}
              onPress={() =>
                router.push({
                  pathname: "/alerts/form",
                  params: { symbol: stock?.symbol, title: stock?.title },
                })
              }
            />
          </HStack>
        </Host>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sm">{label}</Text>
      <Text className="text-sm font-semibold">{value}</Text>
    </View>
  );
}

