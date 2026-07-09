import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Transaction } from "@/types/portfolio";
import { usePortfolioStore } from "@/stores/portfolioStore";
import TransactionCard from "@/components/transactions/TransactionCard";

const TransactionDetails = () => {
  const { portfolioId, symbol, title} = useLocalSearchParams();
  const { getTransactions } = usePortfolioStore();

  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getTransactions(Number(portfolioId), symbol as string);
      setTransactions(transactions);
    };
    fetchTransactions();

    navigation.setOptions({
      headerTitle: title,
    });

  }, [portfolioId]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          symbol={symbol as string}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    // backgroundColor: "#f2f2f2",
  },
});

export default TransactionDetails;
