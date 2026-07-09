import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  formatCurrency,
  formatPercentage,
  formatTransactionNumber,
} from "@/utils/numberUtils";
import { Holding } from "@/types/portfolio";
import { useTranslation } from "react-i18next";

const PortfolioDetails = () => {
  const { t } = useTranslation();
  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { portfolios, getHoldings } = usePortfolioStore();
  const [holdings, setHoldings] = useState<Holding[]>([]);

  const portfolio = portfolios.find((p) => p.id === Number(portfolioId));

  useEffect(() => {
    if (portfolio) {
      navigation.setOptions({ title: portfolio.name });
    }
  }, [portfolio, navigation]);

  useEffect(() => {
    const fetchHoldings = async () => {
      const data = await getHoldings(Number(portfolioId));
      setHoldings(data);
    };
    fetchHoldings();
  }, [portfolioId]);

  if (!portfolio) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F1F3F6]">
        <Text className="text-lg text-red-500">{t("portfolio-not-found")}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className="w-full bg-none border border-gray-200 rounded-xl p-5 mb-2.5"
        style={{
          // elevation: 2,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 0.06,
          // shadowRadius: 4,
        }}
      >
        <Text className="text-base font-bold text-[#333] mb-3 self-start">
          {t("performance")}
        </Text>
        <View className="border-t border-gray-200 pt-2.5 gap-1.5">
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#374151]">{t("total-value")}</Text>
            <Text className="font-semibold text-[#123456]">
              {formatCurrency(portfolio.performance.totalValue)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#374151]">{t("total-cost")}</Text>
            <Text className="font-semibold text-[#123456]">
              {formatCurrency(portfolio.performance.totalCost)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#374151]">
              {t("total-gain-loss")}
            </Text>
            <Text
              className={`font-semibold ${
                portfolio.performance.totalGainLoss >= 0
                  ? "text-[#34C759]"
                  : "text-[#FF3B30]"
              }`}
            >
              {formatCurrency(portfolio.performance.totalGainLoss)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#374151]">
              {t("total-gain-loss-rate")}
            </Text>
            <Text
              className={`font-semibold ${
                portfolio.performance.gainLossPercentage >= 0
                  ? "text-[#34C759]"
                  : "text-[#FF3B30]"
              }`}
            >
              {formatPercentage(portfolio.performance.gainLossPercentage, 2)}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-[13px] text-gray-500 pl-1 mb-3 self-start">
        {t("holdings")}
      </Text>

      {holdings.map((holding) => (
        <View
          key={holding.symbol}
          className="w-full bg-none border border-gray-200 rounded-xl p-5 mb-2.5"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
          }}
        >
          <View className="flex-row justify-between mb-3">
            <Text className="text-base font-bold text-[#1A1A1A]">
              {holding.symbol}
            </Text>
            <Text className="text-base text-[#666]">{holding.name}</Text>
          </View>
          <View className="gap-1.5">
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#374151]">{t("quantity")}</Text>
              <Text className="font-semibold text-[#123456]">
                {formatTransactionNumber(holding.quantity)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#374151]">Gain/Loss</Text>
              <Text
                className={`font-semibold ${
                  holding.gainLoss >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
                }`}
              >
                {formatCurrency(holding.gainLoss)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PortfolioDetails;
