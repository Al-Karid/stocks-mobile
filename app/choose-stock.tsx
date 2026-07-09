import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Stock } from "@/types/stock";
import StockPicker from "@/components/stocks/StockPicker";

export default function ChooseStockScreen() {
  const params = useLocalSearchParams<Record<string, string>>();

  const handleSelect = (item: Stock) => {
    const { nextRoute, ...rest } = params;
    router.back();
    router.push({
      pathname: nextRoute as any,
      params: {
        ...rest,
        symbol: item.symbol,
        title: item.title,
      },
    });
  };

  return (
    <View className="flex-1">
      <StockPicker onSelect={handleSelect} />
    </View>
  );
}
