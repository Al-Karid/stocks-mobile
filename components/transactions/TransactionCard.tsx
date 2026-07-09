import React from "react";
import { View, Text } from "react-native";
import { Transaction } from "@/types/portfolio";
import {
  formatTransactionCurrency,
  formatTransactionNumber,
} from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

interface Props {
  transaction: Transaction;
  symbol: string;
}

const TransactionCard = ({ transaction, symbol }: Props) => {
  const { t } = useTranslation();

  return (
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
      <View className="flex-row justify-between items-center mb-4">
        <View
          className={`px-3 py-1 rounded-full ${
            transaction.type === "BUY" ? "bg-[#34C759]" : "bg-[#FF3B30]"
          }`}
        >
          <Text className="text-white font-bold text-sm">
            {transaction.type}
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-200 pt-2.5 gap-1.5">
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#374151]">{t("quantity")}</Text>
          <Text className="font-semibold text-[#123456]">
            {formatTransactionNumber(transaction.quantity)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#374151]">
            {t("price-per-share-fcfa")}
          </Text>
          <Text className="font-semibold text-[#123456]">
            {formatTransactionCurrency(transaction.realPricePerShare)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#374151]">{t("total-cost")}</Text>
          <Text className="font-semibold text-[#123456]">
            {formatTransactionCurrency(transaction.totalCost)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#374151]">
            {t("transaction-date")}
          </Text>
          <Text className="font-semibold text-[#123456]">
            {new Date(transaction.transactionDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#374151]">
            {t("transaction-fees")}
          </Text>
          <Text className="font-semibold text-[#123456]">
            {transaction.fees}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;
