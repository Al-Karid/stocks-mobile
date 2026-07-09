import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  Switch,
  TouchableOpacity,
} from "react-native";
import { globalCardStyles } from "@/styles/globalStyles";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { HeaderButton } from "@react-navigation/elements";
import { AlertData } from "@/types/alerts";
import { Colors } from "@/styles/colors";
import { Stock } from "@/types/stock";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useAlertStore } from "@/stores/alertStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

const AlertsScreen: React.FC = () => {
  const { t } = useTranslation();

  const {
    alerts: alertStore,
    removeAlert,
    fetchAlerts,
    toggleAlertState,
  } = useAlertStore();
  const { showActionSheetWithOptions } = useActionSheet();
  const {
    userContraintCounts,
    increaseUserContraintCounts,
    decreaseUserContraintCounts,
  } = useSettingsStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  const [userCanAddAlert, setUserCanAddAlert] = useState(true);
  useEffect(() => {
    setUserCanAddAlert(userContraintCounts.maxAlerts !== 0);
  }, [userContraintCounts]);

  useEffect(() => {
    const loadAlerts = async () => {
      await fetchAlerts();
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={() => openStockModal()}>
          <MaterialIcons name="notification-add" size={23} />
        </HeaderButton>
      ),
    });
  }, [navigation]);

  const handleDelete = (alert: AlertData) => {
    Alert.alert(alert.stockTitle!, t("delete-this-alert"), [
      { text: t("cancel") },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          removeAlert(alert.id);
          increaseUserContraintCounts("maxAlerts");
        },
      },
    ]);
  };

  const openActionSheet = (alert: AlertData) => {
    const options = [t("edit"), t("delete"), t("cancel")];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: `${alert.stockTitle}`,
      },
      (index?: number) => {
        if (index === 0) {
          router.push({
            pathname: "/alerts/form",
            params: { alertId: alert.id },
          });
        } else if (index === 1) {
          handleDelete(alert);
        }
      },
    );
  };

  const [stocks, setStocks] = useState<Stock[]>([]);
  const { fetchStocks } = useStockRepository();

  useEffect(() => {
    const loadStocks = async () => {
      const result = await fetchStocks();
      setStocks(result);
    };
    loadStocks();
  }, []);

  const openStockModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeStockModal = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleStockSelect = (stock: Stock) => {
    closeStockModal();
    router.push({
      pathname: "/alerts/form",
      params: {
        stockSymbol: stock.symbol,
        stockTitle: stock.title,
      },
    });
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <Pressable onPress={() => handleStockSelect(item)} style={styles.stockItem}>
      <Text style={styles.stockItemText}>{item.title}</Text>
    </Pressable>
  );

  const renderStockSelector = () => (
    <>
      <Text style={styles.modalTitle}>{t("choose-a-stock")}</Text>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={renderStockItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={{ marginTop: 16 }}>
        <Pressable onPress={closeStockModal} style={styles.modalCancelButton}>
          <Text style={styles.modalCancelButtonText}>{t("cancel")}</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alertStore}
        contentContainerStyle={{ paddingTop: 16 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-20 px-8">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-5">
              <Feather name="bell-off" size={36} color="#9ca3af" />
            </View>
            <Text className="text-sm text-gray-400 text-center">
              {t("no-alerts-set-tap-the-button-to-add-one")}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => openActionSheet(item)}>
            <View style={globalCardStyles.card}>
              <View style={styles.header}>
                <Text style={styles.cardName}>{item.stockTitle}</Text>
                <Switch
                  value={Boolean(item.enabled)}
                  onValueChange={() => toggleAlertState(item.id)}
                />
              </View>

              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.cardCondition,
                    {
                      color: item.enabled
                        ? item.alertType === "above"
                          ? "#4CAF50"
                          : "#F44336"
                        : "#9E9E9E",
                    },
                  ]}
                >
                  {item.alertType === "above" ? (
                    <>
                      <Feather
                        name="arrow-up"
                        size={16}
                        color={item.enabled ? "#4CAF50" : "#9E9E9E"}
                      />{" "}
                      {t("above-threshold")} {item.value}
                    </>
                  ) : (
                    <>
                      <Feather
                        name="arrow-down"
                        size={16}
                        color={item.enabled ? "#F44336" : "#9E9E9E"}
                      />{" "}
                      {t("below-threshold")} {item.value}
                    </>
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["60%"]}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          {renderStockSelector()}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, paddingTop: 8 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardName: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  cardCondition: {
    fontSize: 16,
    color: "#4CAF50",
  },
  stockItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  stockItemText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalCancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
