import React from "react";
import { View, Text } from "react-native";
import { Stock } from "@/types/stock";
import StockCard from "@/components/stocks/StockCard";
import { useTranslation } from "react-i18next";

interface StocksSectionProps {
  stocks: Stock[];
}

const StocksSection: React.FC<StocksSectionProps> = ({ stocks }) => {
  const { t } = useTranslation();

  const uniqueStocks = stocks.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.id === value.id),
  );

  return (
    <View className="px-5 pb-8">
      <Text className="text-[22px] font-bold text-[#123458] mb-3 ml-1">
        {t("stocks")}
      </Text>
      <Text className="text-xs text-gray-400 mb-2 ml-1">
        {uniqueStocks.length} {t("stocks").toLowerCase()}
      </Text>

      <View className="gap-3">
        {uniqueStocks.map((item) => (
          <StockCard
            key={item.id}
            name={item.title.trimStart()}
            symbol={item.symbol}
            currentPrice={item.currentPrice}
            previousClosePrice={item.previousClosePrice}
            percentageChange={item.percentageChange}
            volumeTitles={item.volumeTitles}
            volumeValues={item.volumeValues}
            opening={item.opening}
            high={item.high}
            low={item.low}
            isInWatchlist={item.isInWatchlist ?? false}
          />
        ))}
      </View>
    </View>
  );
};

export default StocksSection;
