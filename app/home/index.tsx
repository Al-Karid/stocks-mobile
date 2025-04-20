import React, { useEffect, useSyncExternalStore } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { initDb } from "../../data/db/stockDatabase";
import { initPortfolioDb } from "@/data/db/portfolioDatabase";
import { syncStockDataFromServer } from "@/data/db/syncStocks";
import UpdatedAt from "@/components/views/UpdatedAt";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const navigateTo = (screen: string) => router.push(`/${screen}`);

  useEffect(() => {
    const init = async () => {
      try {
        await initDb();
        await initPortfolioDb();
        await syncStockDataFromServer();
        console.log("✅ All databases initialized successfully");
      } catch (e) {
        console.error("❌ Failed to initialize databases", e);
      }
    };
    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncStockDataFromServer();
      console.log("✅ Data refreshed successfully");
    } catch (e) {
      console.error("❌ Failed to refresh data", e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3D90D7"]} />
        }
      >
        <Text style={styles.title}>Stock Tracker</Text>

        <UpdatedAt />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.palmares]}
            onPress={() => navigateTo("stocks/palmares")}
          >
            <Text style={styles.buttonText}>Palmarès</Text>
            <FontAwesome name="line-chart" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.stocks]}
            onPress={() => navigateTo("stocks")}
          >
            <Text style={styles.buttonText}>Stocks</Text>
            <FontAwesome name="bar-chart" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.watchlist]}
            onPress={() => navigateTo("watchlist")}
          >
            <Text style={styles.buttonText}>Watchlist</Text>
            <FontAwesome name="eye" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.portfolio]}
            onPress={() => navigateTo("portfolio")}
          >
            <Text style={styles.buttonText}>Portfolio</Text>
            <FontAwesome name="folder" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.alerts]}>
            <Text style={styles.buttonText}>Alerts</Text>
            <FontAwesome name="lock" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.copyRight}>© Revalys Data Services - 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flexGrow: 1, // Ensures the content is scrollable even if it doesn't fill the screen
    backgroundColor: "#f7f7f7", // Light background color for modern look
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25,
    paddingVertical: 22,
    paddingHorizontal: 25,
    marginBottom: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  palmares: {
    backgroundColor: "#3b82f6", // Blue
  },
  stocks: {
    backgroundColor: "#10b981", // Green
  },
  watchlist: {
    backgroundColor: "#f59e0b", // Yellow
  },
  portfolio: {
    backgroundColor: "#8b5cf6", // Purple
    // backgroundColor: "#A6AEBF", // Purple
  },
  alerts: {
    // backgroundColor: "#ef4444", // Red
    backgroundColor: "#A6AEBF", // Red
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  copyRight: {
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    marginTop: 0,
  },
  syncButton: {
    // position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#210F37",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
});
