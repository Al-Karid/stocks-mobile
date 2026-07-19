import React from "react";
import { View, Text } from "react-native";
import { Stock } from "@/types/stock";
import PalmaresCircle from "@/components/stocks/PalmaresCircle";
import { useTranslation } from "react-i18next";

interface PalmaresSectionProps {
  stocks: Stock[];
}

const PalmaresSection: React.FC<PalmaresSectionProps> = ({ stocks }) => {
  const { t } = useTranslation();

  const top10 = stocks
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id),
    )
    .slice(0, 10);

  return (
    <View className="flex-1 px-5 pt-5 pb-5">
      <Text className="text-[22px] font-bold text-[#123458] mb-4 ml-1">
        {t("palmares")}
      </Text>

      <View className="flex-row flex-wrap gap-x-[2.5%] gap-y-2 py-2">
        {top10.map((item, index) => (
          <PalmaresCircle
            key={item.id}
            index={index}
            total={top10.length}
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
            isInWatchlist={false}
          />
        ))}
      </View>
    </View>
  );
};

export default PalmaresSection;
