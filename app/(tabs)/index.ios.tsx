import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  RefreshControl,
} from "react-native";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import DashboardHeader from '@/components/views/DashboardHeader';
import PortfolioDistribution from '@/components/views/PortfolioDistribution';
import WatchlistSection from '@/components/views/WatchlistSection';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useUserStore } from '@/stores/userStore';
import { useStockSync } from '@/data/configs/syncStocks';
import { formatRelativeDate } from '@/utils/dateUtils';
import { Portfolio } from '@/types/portfolio';
import { Storage } from 'expo-sqlite/kv-store';
import { useTranslation } from 'react-i18next';

const HEADER_HEIGHT = 300;

export default function StabilizedOverscrollScreen() {
  const { t } = useTranslation();
  const { syncStockDataFromServer } = useStockSync();
  const { portfolios } = usePortfolioStore();
  const { user } = useUserStore();
  const [defaultPortfolio, setDefaultPortfolio] = useState<Portfolio>();
  const [lastSync, setLastSync] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchLastSyncDate = async () => {
    const lastSyncDate = await Storage.getItem('lastSync');
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
            colors={['#007AFF']}
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
          <PortfolioDistribution portfolio={defaultPortfolio} lastSync={lastSync} />

          <WatchlistSection />
        </View>
      </ScrollView>
    </View>
  );
}

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

});