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
  Platform,
} from "react-native";
import { globalCardStyles } from "@/styles/globalStyles";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { AlertData } from "@/types/alerts";
import { Colors } from "@/styles/colors";
import { Stock } from "@/types/stock";
import { useAlertStore } from "@/stores/alertStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";
import AlertEmptyState from "@/components/alerts/AlertEmptyState";
import StockSelector, { StockSelectorRef } from "@/components/shared/StockSelector";

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

  const stockSelectorRef = useRef<StockSelectorRef>(null);
  const navigation = useNavigation();

  const [userCanAddAlert, setUserCanAddAlert] = useState(true);
  useEffect(() => {
    if (userContraintCounts.maxAlerts === 0) {
      setUserCanAddAlert(false);
    } else {
      setUserCanAddAlert(true);
    }
  }, [userContraintCounts]);

  useEffect(() => {
    const loadAlerts = async () => {
      await fetchAlerts();
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => stockSelectorRef.current?.open()}>
            <MaterialIcons
              style={{ marginRight: 5, marginTop: 0 }}
              name="notification-add"
              size={23}
              color={Colors.headerBlue}
            />
          </TouchableOpacity>
        ),
      });
    }
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
            params: {
              alertId: alert.id,
            },
          });
        } else if (index === 1) {
          handleDelete(alert);
        }
      }
    );
  };

  const handleStockSelect = (stock: Stock) => {
    router.push({
      pathname: "/alerts/form",
      params: {
        stockSymbol: stock.symbol,
        stockTitle: stock.title,
      },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alertStore}
        contentContainerStyle={{ paddingTop: 16 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={AlertEmptyState}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => openActionSheet(item)}>
            <View style={globalCardStyles.card}>
              <View style={styles.header}>
                {/* <Text style={styles.stock}>{item.stockSymbol}</Text> */}
                <Text style={styles.cardName}>{item.stockTitle}</Text>
                {Platform.OS === "ios" ? (
                  <Switch
                    value={Boolean(item.enabled)}
                    onValueChange={() => toggleAlertState(item.id)}
                  />
                ) : (
                  <Switch
                    value={Boolean(item.enabled)}
                    onValueChange={() => toggleAlertState(item.id)}
                    trackColor={{ false: "#ccc", true: "#000" }}
                    thumbColor={item.enabled ? "#000" : "#f4f3f4"}
                  />
                )}
              </View>

              <View style={styles.cardContent}>
                {/* <Text style={styles.cardName}>{item.stockSymbol}</Text> */}
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
                      {t('above-threshold')} {item.value}
                    </>
                  ) : (
                    <>
                      <Feather
                        name="arrow-down"
                        size={16}
                        color={item.enabled ? "#F44336" : "#9E9E9E"}
                      />{" "}
                      {t('below-threshold')} {item.value}
                    </>
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      {Platform.OS === "android" && (
        <Pressable
          disabled={!userCanAddAlert}
          onPress={() => stockSelectorRef.current?.open()}
          style={[
            styles.fab,
            { backgroundColor: userCanAddAlert ? "black" : "#ccc" },
          ]}
        >
          <Feather
            name="plus"
            size={24}
            color={userCanAddAlert ? "white" : "black"}
          />
        </Pressable>
      )}

      <StockSelector ref={stockSelectorRef} onSelectStock={handleStockSelect} />
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
    // marginBottom: 10,
  },
  stock: {
    fontSize: 18,
    fontWeight: "500",
    color: "#123456",
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
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "black", // Purple for modern look
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});
