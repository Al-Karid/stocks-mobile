import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import DashboardHeader from '@/components/views/DashboardHeader';
import { useWatchlistStore } from '@/stores/watchlistStore';
import StockRow from '@/components/stocks/StockRow';
import { useRouter } from 'expo-router';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { usePortfolioStore } from '@/stores/portfolioStore';
import AssetCard from '@/components/stocks/AssetCard';
import { useStockSync } from '@/data/configs/syncStocks';
import { formatRelativeDate } from '@/utils/dateUtils';
import { Portfolio } from '@/types/portfolio';
import { Storage } from "expo-sqlite/kv-store";
import { useUserStore } from '@/stores/userStore';
import { changeLanguage } from '@/utils/languageUtils';
import { useTranslation } from 'react-i18next';

const HEADER_HEIGHT = 300;

const DashboardScreen = () => {

  const { t } = useTranslation();

  const { syncStockDataFromServer } = useStockSync();
  const { watchlist: watchlistStore } = useWatchlistStore();
  const { portfolios } = usePortfolioStore();
  const { user } = useUserStore();

  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string>();
  const [defaultPortfolio, setDefaultPortfolio] = useState<Portfolio>();

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
    const portfolio = portfolios.find((p) => p.isDefault);
    setDefaultPortfolio(portfolio);
  }, [portfolios]);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => {
        setStatusBarStyle("dark");
      };
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await syncStockDataFromServer();
    await fetchLastSyncDate();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Static background shown during top overscroll */}
      <View style={styles.topBackground} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        bounces
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
            progressBackgroundColor="white"
          />
        }
      >
        {/* HEADER */}
        {defaultPortfolio && defaultPortfolio.performance ? (
          <DashboardHeader portfolio={defaultPortfolio} displayName={user?.name} />
        ) : (
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#6b7280' }}>{t('no-portfolio-available')}</Text>
          </View>
        )}

        {/* BODY */}
        <View style={styles.whiteBody}>

          {/* PORTFOLIO DISTRIBUTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('portfolio_distribution')}</Text>
              <TouchableOpacity onPress={() => changeLanguage('fr')}>
                <Text style={styles.seeAll}>{lastSync}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {defaultPortfolio?.holdings && defaultPortfolio.holdings.length > 0 ? (
                <>
                  {defaultPortfolio.holdings.slice(0, 3).map((holding) => (
                    <AssetCard key={holding.symbol} holding={holding} />
                  ))}
                  <TouchableOpacity
                    style={styles.seeMoreCard}
                    onPress={() => { provideHapticFeedback(); router.navigate('/(tabs)/portfolio'); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seeMoreText}>{t('see-more')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.emptyPortfolioCard}
                  onPress={() => { provideHapticFeedback(); router.navigate('/(tabs)/portfolio'); }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="folder-open-outline" size={24} color="#8b5cf6" />
                  <Text style={styles.emptyPortfolioTitle}>Your portfolio is empty</Text>
                  <Text style={styles.emptyPortfolioText}>Add a holding to see it here.</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* WATCHLIST */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('my-watchlist')}</Text>
              <TouchableOpacity onPress={() => { provideHapticFeedback(); router.push('/stocks'); }}>
                <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {watchlistStore.length > 0 ? (
              watchlistStore.slice(0, 2).map((stock) => (
                <StockRow key={stock.id} stock={stock} />
              ))
            ) : (
              <View style={styles.emptyWatchlistCard}>
                <Text style={styles.emptyWatchlistTitle}>Your watchlist is empty</Text>
                <Text style={styles.emptyWatchlistText}>Add a few stocks to follow them here.</Text>
                <TouchableOpacity style={styles.seeMoreButton} onPress={() => { provideHapticFeedback(); router.push('/stocks'); }}>
                  <Text style={styles.seeMoreButtonText}>Browse stocks</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 100,
    backgroundColor: '#121212',
  },

  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  contentContainer: {
    paddingBottom: 40,
    marginTop: 40
  },

  whiteBody: {
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -32,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 600,
  },

  section: {
    marginTop: 10,
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
  emptyPortfolioCard: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  emptyPortfolioTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  emptyPortfolioText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyWatchlistCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  emptyWatchlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  emptyWatchlistText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  seeMoreButton: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  seeMoreButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  seeMoreCard: {
    minWidth: 80,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    marginRight: 12,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default DashboardScreen;