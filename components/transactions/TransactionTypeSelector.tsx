import React from "react";
import { Pressable, Text } from "react-native";
import { TransactionType } from "@/types/portfolio";
import { formatNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

interface TransactionTypeSelectorProps {
  type: TransactionType;
  onSelect: (type: TransactionType) => void;
  price?: number;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  type,
  onSelect,
  price,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {(["BUY", "SELL"] as TransactionType[]).map((value) => (
        <Pressable
          key={value}
          className={`flex-1 aspect-square rounded-2xl border items-center justify-center transition-all duration-300 active:scale-95 ${
            type === value
              ? "bg-black border-black ring-2 ring-black ring-offset-2"
              : "bg-gray-100 border-black ring-0"
          }`}
          onPress={() => onSelect(value)}
        >
          <Text
            className={`font-semibold text-lg transition-colors duration-300 ${
              type === value ? "text-white" : "text-gray-800"
            }`}
          >
            {value === "BUY" ? t("buy") : t("sell")}
          </Text>
          {value === "BUY" && price != null && (
            <Text
              className={`text-sm mt-1 transition-colors duration-300 ${
                type === value ? "text-white/70" : "text-gray-500"
              }`}
            >
              {formatNumber(price)} FCFA
            </Text>
          )}
        </Pressable>
      ))}
    </>
  );
};

export default TransactionTypeSelector;
