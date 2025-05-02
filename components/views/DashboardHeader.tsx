import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Portfolio } from '@/types/portfolio';
import { formatCurrency, formatPercentage } from '@/utils/numberUtils';
import { router, useRouter } from 'expo-router';

interface DashboardHeaderProps {
  portfolio: Portfolio;
  displayName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ portfolio, displayName }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example count

  const { performance } = portfolio;
  const { totalValue, gainLossPercentage, totalGainLoss } = performance;

  const isPositive = totalGainLoss >= 0;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.userSection} onPress={() => router.push('/settings')}>
          <Ionicons name="person-circle-outline" size={28} color="white" style={styles.userIcon} />
          <Text style={styles.greeting}>Akwaba {displayName ? ", " + displayName : ""}</Text>
        </TouchableOpacity>

        <View style={styles.icons}>
          <TouchableOpacity onPress={() => router.push('/alerts/notifications')} style={styles.notificationIconContainer}>
            <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
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
          {isPositive ? '▲' : '▼'} {formatCurrency(totalGainLoss, 0, "XOF", true)} ({formatPercentage(gainLossPercentage, 2)})
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
    marginRight: 5,
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
    marginBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 8,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DashboardHeader;
