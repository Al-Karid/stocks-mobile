import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage, isPositiveNumber } from "@/utils/numberUtils";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface StockRowProps {
  stock: Stock;
  onSelect?: (symbol: string) => void;
}

const StockRow: React.FC<StockRowProps> = ({ stock, onSelect }) => {
  const { title, symbol, currentPrice, previousClosePrice } = stock;
  const isPositive = isPositiveNumber(currentPrice - previousClosePrice);
  const changeRaw = ((currentPrice - previousClosePrice) / previousClosePrice) * 100;
  const change = formatPercentage(changeRaw, 2);

  const handlePress = () => {
    if (onSelect) {
      onSelect(symbol);
    } else {
      router.push({ pathname: "/stocks/details", params: { symbol: stock.symbol } });
    }
  };

  return (
    <TouchableOpacity
      className="rounded-2xl p-5 mb-3 border border-white/30 bg-white"
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-[#171717] mb-1">
            {symbol}
          </Text>
          <Text className="text-[12px] text-[#a3a3a3]">
            {title}
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Feather
              name={isPositive ? "trending-up" : "trending-down"}
              size={14}
              color={isPositive ? "#16a34a" : "#dc2626"}
            />
            <Text
              className="text-[15px] font-bold"
              style={{ color: isPositive ? "#16a34a" : "#dc2626" }}
            >
              {change}
            </Text>
          </View>
          <Text className="text-[15px] text-[#171717]">
            {formatCurrency(currentPrice)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StockRow;