import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portfolio } from '@/types/portfolio';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/numberUtils';

interface DashboardHeaderProps {
  portfolio: Portfolio;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ portfolio }) => {
  const [isHidden, setIsHidden] = useState(false);

  const { performance } = portfolio;
  const { totalValue, gainLossPercentage, totalGainLoss } = performance;

  // Determine color based on performance
  const isPositive = totalGainLoss >= 0;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.greeting}>Hello, Al-karid</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.portfolioSection}>
        <Text style={styles.portfolioTitle}>{portfolio.name.toUpperCase()}</Text>
        <View style={styles.portfolioAmountRow}>
          <Text style={styles.portfolioAmount}>
            {isHidden ? '**********' : formatCurrency(totalValue, 0, 'XOF', true)}
          </Text>
          <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
            <Ionicons
              name={isHidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="white"
              style={isHidden ? styles.eyeOff : styles.eye}
            />
          </TouchableOpacity>
        </View>

        {/* {!isHidden && ( */}
        <Text
          style={[
            styles.portfolioChange,
            { color: isPositive ? '#00FF7F' : '#FF4500' } // green if positive, red if negative
          ]}
        >
          {isPositive ? '▲' : '▼'} {formatCurrency(totalGainLoss, 0, "XOF", true)} ({isPositive ? '+' : ''}{formatPercentage(gainLossPercentage, 2)})
        </Text>
        {/* // )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 0,
  },
  portfolioSection: {
    marginTop: 20,
  },
  portfolioTitle: {
    color: 'gray',
    fontSize: 14,
  },
  portfolioAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  portfolioAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  portfolioChange: {
    marginTop: 5,
    fontSize: 16,
  },
  eye: {
    marginLeft: 8,
  },
  eyeOff: {
    marginLeft: 8,
    marginBottom: 12,
  },
});

export default DashboardHeader;
