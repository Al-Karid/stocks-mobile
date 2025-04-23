import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import DashboardHeader from '@/components/views/DashboardHeader';
import { useWatchlistStore } from '@/stores/watchlistStore';
import StockRow from '@/components/stocks/StockRow';
import { router, useRouter } from 'expo-router';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { usePortfolioStore } from '@/stores/portfolioStore';
import AssetCard from '@/components/stocks/AssetCard';
import { syncStockDataFromServer } from '@/data/db/syncStocks';
import { formatRelativeDate } from '@/utils/dateUtils';
import { useInitDatabases } from '@/data/db/initDatabases';
import { Portfolio } from '@/types/portfolio';
import { Storage } from "expo-sqlite/kv-store";

const DashboardScreen = () => {
  const { watchlist: watchlistStore, fetchWatchlist } = useWatchlistStore();
  const { portfolios, fetchPortfolios } = usePortfolioStore();

  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string>();
  const [defaultPortfolio, setDefaultPortfolio] = useState<Portfolio>();

  const { loading, error } = useInitDatabases();
  const router = useRouter();

  const fetchLastSyncDate = async () => {
    const lastSyncDate = await Storage.getItem("lastSync");
    if (lastSyncDate) {
      setLastSync(formatRelativeDate(lastSyncDate));
    }
  };

  useEffect(() => {
    fetchLastSyncDate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading && !error) {
        await fetchWatchlist();
        await fetchPortfolios();
      }
    };
    fetchData();
  }, [loading, error, fetchWatchlist, fetchPortfolios]);

  useEffect(() => {
    const portfolio = portfolios.find((p) => p.isDefault);
    setDefaultPortfolio(portfolio);
  }, [portfolios]);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncStockDataFromServer();
    await fetchWatchlist();
    await fetchPortfolios();
    await fetchLastSyncDate();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
          <Text style={{ color: 'white' }}>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
          <Text style={{ color: 'red' }}>Error: {error}</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <StatusBar barStyle="default" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
              progressBackgroundColor="#121212"
            />
          }
        >
          <View style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>
            {/* HEADER */}
            {defaultPortfolio && defaultPortfolio.performance ? (
              <DashboardHeader portfolio={defaultPortfolio} />
            ) : (
              <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#6b7280' }}>No portfolio available</Text>
              </View>
            )}

            {/* CONTENT */}
            <View style={[styles.content, { flex: 1 }]}>

              {/* PORTFOLIO DISTRIBUTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Portfolio distribution</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>{lastSync}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {defaultPortfolio?.holdings && defaultPortfolio.holdings.length > 0 ? (
                    defaultPortfolio.holdings.map((holding) => (
                      <AssetCard key={holding.symbol} holding={holding} />
                    ))
                  ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No portfolios available</Text>
                  )}
                </ScrollView>
              </View>

              {/* WATCHLIST */}
              <View style={[styles.section, { marginTop: 20 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My watchlist</Text>
                  <TouchableOpacity onPress={() => { provideHapticFeedback(); router.push('/stocks'); }}>
                    <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {watchlistStore.length > 0 ? (
                  watchlistStore.map((stock) => (
                    <StockRow key={stock.id} stock={stock} />
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', marginTop: 20 }}>No stocks in watchlist</Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -30,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 0,
    color: 'gray',
  },
  seeAll: {
    color: '#6b7280',
    fontSize: 11,
    paddingVertical: 5,
  },
});

export default DashboardScreen;
