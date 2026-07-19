import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface PalmaresCircleProps {
  index?: number;
  total?: number;
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

/**
 * Interpolate between green (#16a34a) at position 0 and red (#dc2626) at position total-1.
 * Each circle gets a diagonal gradient that shifts from green-dominant to red-dominant.
 */
function rankGradientColors(index: number, total: number): [string, string] {
  const ratio = total > 1 ? index / (total - 1) : 0;
  // Green  →  Red
  // #16a34a (22, 163, 74)  →  #dc2626 (220, 38, 38)
  const r = Math.round(22 + (220 - 22) * ratio);
  const g = Math.round(163 + (38 - 163) * ratio);
  const b = Math.round(74 + (38 - 74) * ratio);
  const mid = `rgb(${r}, ${g}, ${b})`;
  // Top color stays close to green, bottom shifts toward red
  const topR = Math.round(22 + (220 - 22) * (ratio * 0.3));
  const topG = Math.round(163 + (38 - 163) * (ratio * 0.3));
  const topB = Math.round(74 + (38 - 74) * (ratio * 0.3));
  const top = `rgb(${topR}, ${topG}, ${topB})`;
  const bottom = `rgb(${r}, ${g}, ${b})`;
  return [top, bottom];
}

const PalmaresCircle: React.FC<PalmaresCircleProps> = ({
  index = -1,
  total = 1,
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

  const [topColor, bottomColor] =
    index >= 0 ? rankGradientColors(index, total) : ["#16a34a", "#dc2626"];

  return (
    <TouchableOpacity
      className="w-[18%]"
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
      <LinearGradient
        colors={[topColor, bottomColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 rounded-full items-center justify-center p-1 overflow-hidden"
      >
        <Text className="text-[9px] font-bold text-white mb-0.5" numberOfLines={1}>
          {symbol.trim()}
        </Text>
        <Text className="text-[9px] font-extrabold text-white mb-1">
          {currentPrice}
        </Text>
        <View className="flex-row items-center gap-0.5">
          {isPositive ? (
            <Feather name="arrow-up-right" size={8} color="white" />
          ) : isNegative ? (
            <Feather name="arrow-down-right" size={8} color="white" />
          ) : (
            <Feather name="minus" size={8} color="white" />
          )}
          <Text className="text-[8px] font-bold text-white">
            {percentageChange === 0 ? "0.00%" : percentageChange.toFixed(2) + "%"}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PalmaresCircle;