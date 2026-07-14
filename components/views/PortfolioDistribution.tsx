import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

  const holdings = portfolio?.holdings ?? [];
  const displayHoldings = holdings.slice(0, 3);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('portfolio_distribution')}</Text>
        <TouchableOpacity onPress={() => changeLanguage('fr')}>
          <Text style={styles.seeAll}>{lastSync}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {holdings.length > 0 ? (
          <>
            {displayHoldings.map((holding) => (
              <AssetCard key={holding.symbol} holding={holding} />
            ))}
            <TouchableOpacity
              style={styles.seeMoreCard}
              onPress={handleEmptyPortfolioPress}
              activeOpacity={0.7}
            >
              <View style={styles.seeMoreCircle}>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </View>
              <Text style={styles.seeMoreText}>{t('see-more')}</Text>
            </TouchableOpacity>
          </>
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
  seeMoreCard: {
    minWidth: 80,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    marginRight: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  seeMoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
});

export default PortfolioDistribution;
