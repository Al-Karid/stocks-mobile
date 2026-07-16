import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { globalCardStyles } from "@/styles/globalStyles";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { HeaderButton } from "@react-navigation/elements";
import { AlertData } from "@/types/alerts";
import { useAlertStore } from "@/stores/alertStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";
import AlertEmptyState from "@/components/alerts/AlertEmptyState";

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
        <HeaderButton
          onPress={() =>
            router.push({
              pathname: "/choose-stock",
              params: { nextRoute: "/alerts/form" },
            })
          }
        >
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
});
