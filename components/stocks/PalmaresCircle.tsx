import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
  const variationColor = isPositive ? "#16a34a" : isNegative ? "#dc2626" : "#6b7280";

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
          {currentPrice}
        </Text>
        <View className="flex-row items-center gap-0.5">
          {isPositive ? (
            <Feather name="arrow-up-right" size={8} color={variationColor} />
          ) : isNegative ? (
            <Feather name="arrow-down-right" size={8} color={variationColor} />
          ) : (
            <Feather name="minus" size={8} color={variationColor} />
          )}
          <Text className="text-[8px] font-bold" style={{ color: variationColor }}>
            {percentageChange === 0 ? "0.00%" : percentageChange.toFixed(2) + "%"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PalmaresCircle;
