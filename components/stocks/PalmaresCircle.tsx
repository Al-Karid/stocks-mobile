import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/numberUtils";

interface PalmaresCircleProps {
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
}

const PalmaresCircle: React.FC<PalmaresCircleProps> = ({
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
}) => {
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  return (
    <TouchableOpacity
      className="w-[18%] aspect-square"
      onPress={() =>
        router.push({
          pathname: "/stocks/details",
          params: {
            symbol: symbol.trim(),
            name,
            currentPrice,
            previousClosePrice,
            percentageChange: percentageChange.toFixed(2),
            volumeTitles,
            volumeValues,
            opening,
            high,
            low,
            isInWatchlist: isInWatchlist ? "1" : "0",
          },
        })
      }
    >
      <View
        className="flex-1 rounded-full bg-white items-center justify-center p-1 border border-gray-200"
      >
        <Text className="text-[9px] font-bold text-[#123458] mb-0.5" numberOfLines={1}>
          {symbol.trim()}
        </Text>
        <Text className="text-[9px] font-extrabold text-black mb-1">
          {formatCurrency(currentPrice)}
        </Text>
        <View
          className={`flex-row items-center py-0.5 px-1 rounded-full gap-0.5 ${
            isPositive ? "bg-green-500" : isNegative ? "bg-red-500" : "bg-gray-500"
          }`}
        >
          {isPositive ? (
            <Feather name="arrow-up-right" size={8} color="#fff" />
          ) : isNegative ? (
            <Feather name="arrow-down-right" size={8} color="#fff" />
          ) : (
            <Feather name="minus" size={8} color="#fff" />
          )}
          <Text className="text-[8px] font-bold text-white">
            {percentageChange === 0 ? "0.00%" : percentageChange.toFixed(2) + "%"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PalmaresCircle;
