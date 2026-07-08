import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
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
          style={[
            styles.button,
            type === value && styles.buttonSelected,
          ]}
          onPress={() => onSelect(value)}
        >
          <Text
            style={[
              styles.text,
              type === value && styles.textSelected,
            ]}
          >
            {value === "BUY" ? t("buy") : t("sell")}
          </Text>
        </Pressable>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  buttonSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  text: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  textSelected: {
    color: "#fff",
  },
});

export default TransactionTypeSelector;
