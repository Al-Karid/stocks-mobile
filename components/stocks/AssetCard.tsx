import { Holding } from '@/types/portfolio';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { formatNumber, formatPercentage } from '@/utils/numberUtils';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AssetCardProps {
    holding: Holding;
}

const AssetCard: React.FC<AssetCardProps> = ({ holding }) => {
    const { symbol: ticker, gainLoss: amount, totalCost, portfolioId } = holding;
    const isPositive = amount >= 0;
    const change = totalCost ? ((amount / totalCost) * 100) : 0;

    return (
        <TouchableOpacity onLongPress={() => { provideHapticFeedback(); router.push({ pathname: '/portfolio/holdings', params: { portfolioId } }); }}>
            <View style={styles.assetCard}>
                <Text style={styles.assetTicker}>{ticker}</Text>
                <Text style={styles.assetAmount}>{formatNumber(amount, 0)} XOF</Text>
                <Text style={isPositive ? styles.assetChangePositive : styles.assetChangeNegative}>{formatPercentage(change, 2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    assetCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginRight: 10,
        marginTop: 10,
        minWidth: 125,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 0.5 },
    },
    assetTicker: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    assetAmount: {
        marginTop: 10,
        fontSize: 16,
        color: '#374151', // gray-700
        fontWeight: '600',
        textAlign: 'right',
    },
    assetChangePositive: {
        marginTop: 6,
        color: '#16a34a',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    assetChangeNegative: {
        marginTop: 6,
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'right',
    },
});

export default AssetCard;