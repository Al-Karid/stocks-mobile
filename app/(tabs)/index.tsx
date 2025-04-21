import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

const Dashboard = () => {

  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const { portfolios, fetchPortfolios } = usePortfolioStore();

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
        >
          <View style={{ flex: 1, backgroundColor: 'white', minHeight: '100%' }}>
            <DashboardHeader />

            <View style={[styles.content, { flex: 1 }]}>
              {/* Portfolio Distribution */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Portfolio distribution</Text>
                  {/* <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity> */}
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
  buyingPowerSection: {
    backgroundColor: '#030303',
    padding: 16,
    marginTop: 20,
    borderRadius: 20,
  },
  buyingPowerLabel: {
    color: 'gray',
    fontSize: 14,
  },
  buyingPowerAmount: {
    fontSize: 24,
    // fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#ffffff',
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
    fontSize: 14,
  },
  assetCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
    width: 140,
    // alignItems: 'center',
  },
  assetTicker: {
    fontSize: 18,
    // fontWeight: 'bold',
  },
  assetAmount: {
    marginTop: 10,
    fontSize: 16,
  },
  assetChangePositive: {
    marginTop: 6,
    color: '#00FF7F',
    // fontWeight: 'bold',
  },
  assetChangeNegative: {
    marginTop: 6,
    color: 'red',
    // fontWeight: 'bold',
  },
  watchlistTabs: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  watchlistTab: {
    marginRight: 10,
    color: 'gray',
  },
  watchlistTabActive: {
    marginRight: 10,
    // fontWeight: 'bold',
  },
  /* Removed stockRow styles */
});

export default Dashboard;
