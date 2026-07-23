import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

interface StockCardProps {
  name: string;
  symbol: string;
  currentPrice: number;
  previousClosePrice: number;
  percentageChange: number;
  volumeTitles: number;
  volumeValues: number;
  opening: number;
  high: number;
  low: number;
  isInWatchlist: boolean;
  onSelect?: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  name,
  symbol,
  currentPrice,
  previousClosePrice,
  percentageChange,
  volumeTitles,
  volumeValues,
  opening,
  high,
  low,
  isInWatchlist,
  onSelect,
}) => {
  const { t } = useTranslation();
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  const handlePress = () => {
    if (onSelect) {
      onSelect(symbol.trim());
    } else {
      router.push({
        pathname: "/stocks/details",
        params: { symbol: symbol.trim() },
      });
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-5 mb-0 flex-row items-center border border-gray-100"
      onPress={handlePress}
    >
      <View className="flex-1">
        <Text className="text-base font-bold text-[#123458] mb-2">
          {symbol.trim()}
        </Text>
        <Text className="text-[10px] font-bold text-[#123458] mb-2">
          {name}
        </Text>
        <View className="flex-row gap-4">
          <View>
            <Text className="text-[9px] italic text-[#123458]">
              {t("current-price")}
            </Text>
            <Text className="text-xs text-[#333]">
              {formatCurrency(currentPrice)}
            </Text>
          </View>
          <View>
            <Text className="text-[9px] italic text-[#123458]">
              {t("previous-close-price")}
            </Text>
            <Text className="text-xs text-[#333]">
              {formatCurrency(previousClosePrice)}
            </Text>
          </View>
        </View>
      </View>

      <View
        className={`flex-row items-center py-2.5 px-2.5 rounded-lg ml-3 ${
          isPositive ? "bg-green-500" : isNegative ? "bg-red-500" : "bg-gray-500"
        }`}
      >
        {isPositive ? (
          <Feather name="arrow-up-right" size={18} color="#fff" />
        ) : isNegative ? (
          <Feather name="arrow-down-right" size={18} color="#fff" />
        ) : (
          <Feather name="minus" size={18} color="#fff" />
        )}
        <Text className="text-sm font-bold text-white ml-1.5">
          {percentageChange === 0
            ? "0.00%"
            : percentageChange.toFixed(2) + "%"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default StockCard;