import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { Text, Pressable, SafeAreaView, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useNavigation } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

export default function PortfolioScreen() {
  
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    portfolios: portfolioStore,
    fetchPortfolios,
    addPortfolio,
  } = usePortfolioStore();
  const {
    userContraintCounts,
    increaseUserContraintCounts,
    decreaseUserContraintCounts,
  } = useSettingsStore();

  const [portfolioName, setPortfolioName] = useState("");
  const [isAddVisible, setAddVisible] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const handleOpenDialog = () => {
    provideHapticFeedback();
    setAddVisible(true);
  };

  const handleSavePortfolio = async (name: string) => {
    if (portfolioName.trim() === "") {
      alert(t('please-enter-a-portfolio-name'));
      return;
    }
    await addPortfolio(portfolioName);
    decreaseUserContraintCounts("maxPorfolio");
    setPortfolioName("");
    setAddVisible(false);
    await fetchPortfolios();
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    setPortfolios(portfolioStore);
  }, [portfolioStore]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" ? (
          <Pressable
            style={{ marginRight: 5, marginTop: 6 }}
            onPress={handleOpenDialog}
          >
            <AntDesign name="folder" size={20} color="#007AFF" />
          </Pressable>
        ) : null,
    });
  }, [navigation]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <StatusBar style="dark" />
        <ActionSheetProvider>
          <>
            <PortfolioListing portfolios={portfolios} />

            <Dialog.Container visible={isAddVisible}>
              <Dialog.Title>
                <Text>{t('create-portfolio')}</Text>
              </Dialog.Title>
              <Dialog.Input
                placeholder={t('please-enter-a-portfolio-name')}
                value={portfolioName}
                onChangeText={setPortfolioName}
              />
              <Dialog.Button
                label={t('cancel')}
                onPress={() => handleCloseDialog(setAddVisible)}
              />
              <Dialog.Button
                label={t('create')}
                onPress={() => handleSavePortfolio(portfolioName)}
              />
            </Dialog.Container>
          </>
        </ActionSheetProvider>
        {Platform.OS === "android" && (
          <Pressable
            disabled={userContraintCounts.maxPorfolio == 0}
            onPress={handleOpenDialog}
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              backgroundColor:
                userContraintCounts.maxPorfolio == 0 ? "#E0E0E0" : "black",
              borderRadius: 30,
              padding: 16,
              elevation: 5,
            }}
          >
            <AntDesign name="folder" size={24} color={userContraintCounts.maxPorfolio == 0 ? "black" : "white"} />
          </Pressable>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
