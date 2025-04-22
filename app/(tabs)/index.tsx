import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import DashboardHeader from '@/components/views/DashboardHeader';
import { useWatchlistStore } from '@/stores/watchlistStore';
import StockRow from '@/components/stocks/StockRow';
import { router } from 'expo-router';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { usePortfolioStore } from '@/stores/portfolioStore';
import AssetCard from '@/components/stocks/AssetCard';
import { syncStockDataFromServer } from '@/data/db/syncStocks';
import { formatLocalDate, formatRelativeDate } from '@/utils/dateUtils';

const DashboardScreen = () => {

  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const { portfolios, fetchPortfolios } = usePortfolioStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncStockDataFromServer();
    await fetchWatchlist();
    await fetchPortfolios();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWatchlist();
      await fetchPortfolios();
    };
    fetchData();
  }, []);

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
            colors={["#007AFF"]}          // Couleur de la roue Android
            tintColor="#007AFF"            // Couleur de la roue iOS
            progressBackgroundColor="#121212" // Couleur du fond du cercle sur Android
          />
          }
        >
          <View style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>
            {portfolios.length > 0 && portfolios[0]?.performance ? (
              <DashboardHeader portfolio={portfolios[0]} />
            )
              : (
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: '#6b7280' }}>No portfolio available</Text>
                </View>
              )}
            <View style={[styles.content, { flex: 1 }]}>
              {/* Portfolio Distribution */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Portfolio distribution</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>{formatRelativeDate(watchlist[0].updatedAt)}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {portfolios.length > 0 && portfolios[0]?.holdings?.length > 0 ? (
                    portfolios[0].holdings.map((holding) => (
                      <AssetCard key={holding.symbol} holding={holding} />
                    ))
                  ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No portfolios available</Text>
                  )}

                </ScrollView>
              </View>

              {/* Watchlist */}
              <View style={[styles.section, { marginTop: 20 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My watchlist</Text>
                  <TouchableOpacity onPress={() => { provideHapticFeedback(); router.push('/stocks') }}>
                    <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Removed all StockRow components */}
                {watchlist.length > 0 ? (
                  watchlist.map((stock) => (
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
