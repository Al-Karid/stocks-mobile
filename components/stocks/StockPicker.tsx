import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";

interface StockPickerProps {
  onSelect: (stock: Stock) => void;
}

export default function StockPicker({ onSelect }: StockPickerProps) {
  const { fetchStocks } = useStockRepository();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  const renderStockItem = ({ item }: { item: Stock }) => (
    <Pressable
      onPress={() => onSelect(item)}
      className="flex-row items-center px-5 py-4 border-b border-gray-100 active:bg-gray-50"
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Text className="text-sm font-bold text-gray-500">
          {item.symbol.slice(0, 2)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.symbol}
        </Text>
        <Text className="text-xs text-gray-400 mt-0.5">{item.title}</Text>
      </View>
      <View className="items-end mr-3">
        <Text className="text-base font-semibold text-gray-900">
          {item.currentPrice?.toLocaleString()} FCFA
        </Text>
        <View className="flex-row items-center mt-0.5">
          <Text
            className={`text-xs font-semibold ${
              item.percentageChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.percentageChange >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(item.percentageChange).toFixed(2)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStockItem}
      contentContainerStyle={{ paddingBottom: 70 }}
    />
  );
}
