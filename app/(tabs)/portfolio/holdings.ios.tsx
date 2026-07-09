import { useEffect, useState } from "react";
import { HeaderButton } from "@react-navigation/elements";
import HoldingListing from "@/components/holdings/HoldingListing";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useTranslation } from "react-i18next";

export default function HoldingsScreen() {

  const { t } = useTranslation();

  const { portfolioId } = useLocalSearchParams();
  const navigation = useNavigation();

  const [portfolioName, setPortfolioName] = useState<string>("");
  const { holdings, getHoldings, portfolios } = usePortfolioStore();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={handleNewTransaction}>
          <Feather name="edit-3" size={19} />
        </HeaderButton>
      ),
    });

    getHoldings(Number(portfolioId));

    const fetchPortfolioName = async () => {
      const portfolio = portfolios.find((p) => p.id === Number(portfolioId));
      if (portfolio) {
        setPortfolioName(portfolio.name);
      }
    };
    fetchPortfolioName();
  }, []);

  useEffect(() => {
    if (portfolioName) {
      navigation.setOptions({ headerTitle: portfolioName.toUpperCase() });
    }
  }, [portfolioName]);

  const handleNewTransaction = () => {
    provideHapticFeedback();
    router.push({
      pathname: "/choose-stock",
      params: { portfolioId, nextRoute: "/transactions/new" },
    });
  };

  const handleHoldingLongPress = (symbol: string) => {
    provideHapticFeedback();
    router.push({
      pathname: "/transactions/history",
      params: { portfolioId, symbol },
    });
  };

  return (
    <HoldingListing
      holdings={holdings}
      onHoldingLongPress={handleHoldingLongPress}
    />
  );
}
