import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AssetCard from '@/components/stocks/AssetCard';
import EmptyPortfolioCard from '@/components/stocks/EmptyPortfolioCard';
import { Portfolio } from '@/types/portfolio';
import { changeLanguage } from '@/utils/languageUtils';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { useTranslation } from 'react-i18next';

interface PortfolioDistributionProps {
  portfolio?: Portfolio;
  lastSync?: string;
}

const PortfolioDistribution: React.FC<PortfolioDistributionProps> = ({ portfolio, lastSync }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleEmptyPortfolioPress = () => {
    provideHapticFeedback();
    router.navigate('/(tabs)/portfolio');
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('portfolio_distribution')}</Text>
        <TouchableOpacity onPress={() => changeLanguage('fr')}>
          <Text style={styles.seeAll}>{lastSync}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {portfolio?.holdings && portfolio.holdings.length > 0 ? (
          portfolio.holdings.slice(0, 2).map((holding) => (
            <AssetCard key={holding.symbol} holding={holding} />
          ))
        ) : (
          <EmptyPortfolioCard onPress={handleEmptyPortfolioPress} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 0,
    // backgroundColor: '#f2f2f2',
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

export default PortfolioDistribution;
