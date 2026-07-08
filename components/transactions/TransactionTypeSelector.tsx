import React from "react";
import { Pressable, Text } from "react-native";
import { TransactionType } from "@/types/portfolio";
import { useTranslation } from "react-i18next";

interface TransactionTypeSelectorProps {
  type: TransactionType;
  onSelect: (type: TransactionType) => void;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  type,
  onSelect,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {(["BUY", "SELL"] as TransactionType[]).map((value) => (
        <Pressable
          key={value}
          className={`flex-1 aspect-square rounded-2xl border items-center justify-center ${
            type === value
              ? "bg-black border-black"
              : "bg-gray-100 border-gray-300"
          }`}
          onPress={() => onSelect(value)}
        >
          <Text
            className={`font-semibold text-[15px] ${
              type === value ? "text-white" : "text-gray-800"
            }`}
          >
            {value === "BUY" ? t("buy") : t("sell")}
          </Text>
        </Pressable>
      ))}
    </>
  );
};

export default TransactionTypeSelector;
