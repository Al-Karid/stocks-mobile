import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const Dashboard = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content"/>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.greeting}>Hello, Josh</Text>
                    <View style={styles.icons}>
                        {/* <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} /> */}
                        <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
                            {/* <Text style={styles.rewardsText}>Rewards</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Portfolio */}
                <View style={styles.portfolioSection}>
                    <Text style={styles.portfolioTitle}>Total portfolio</Text>
                    <View style={styles.portfolioAmountRow}>
                        <Text style={styles.portfolioAmount}>$16,458.50</Text>
                        <Ionicons name="eye-outline" size={20} color="white" style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={styles.portfolioChange}>▲ $1.20 (2.40%)</Text>
                </View>

                {/* Buying Power */}
                {/* <View style={styles.buyingPowerSection}>
                    <Text style={styles.buyingPowerLabel}>Buying power</Text>
                    <Text style={styles.buyingPowerAmount}>$2,458.50</Text>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
                            <Text style={styles.actionButtonText}>Deposit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-down-circle-outline" size={24} color="white" />
                            <Text style={styles.actionButtonText}>Withdraw</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="white" />
                            <Text style={styles.actionButtonText}>More</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
            </View>

            <View style={styles.content} >

                {/* Portfolio Distribution */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Portfolio distribution</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.assetCard}>
                            <Text style={styles.assetTicker}>AAPL</Text>
                            <Text style={styles.assetAmount}>$1,788.50</Text>
                            <Text style={styles.assetChangePositive}>▲ 2.22%</Text>
                        </View>
                        <View style={styles.assetCard}>
                            <Text style={styles.assetTicker}>NVDA</Text>
                            <Text style={styles.assetAmount}>$2,521.05</Text>
                            <Text style={styles.assetChangeNegative}>▼ 0.50%</Text>
                        </View>
                        {/* Add more if needed */}
                    </ScrollView>
                </View>

                {/* Watchlist */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My watchlist</Text>
                        <Ionicons name="add-circle-outline" size={24} color="black" />
                    </View>

                    {/* <View style={styles.watchlistTabs}>
                        <Text style={styles.watchlistTabActive}>All watchlist</Text>
                        <Text style={styles.watchlistTab}>Volatile</Text>
                        <Text style={styles.watchlistTab}>Growth</Text>
                        <Text style={styles.watchlistTab}>Tech</Text>
                        <Text style={styles.watchlistTab}>Blue</Text>
                    </View> */}

                    {/* Stocks */}
                    <View style={styles.stockRow}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/888/888879.png' }} style={styles.stockLogo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stockName}>TSLA</Text>
                            <Text style={styles.stockCompany}>Tesla Inc.</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.stockPrice}>$345.20</Text>
                            <Text style={styles.stockChangePositive}>▲ 0.93%</Text>
                        </View>
                    </View>

                    <View style={styles.stockRow}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732229.png' }} style={styles.stockLogo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stockName}>AMZN</Text>
                            <Text style={styles.stockCompany}>Amazon</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.stockPrice}>$128.47</Text>
                            <Text style={styles.stockChangeNegative}>▼ 0.85%</Text>
                        </View>
                    </View>

                    <View style={styles.stockRow}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' }} style={styles.stockLogo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stockName}>MSFT</Text>
                            <Text style={styles.stockCompany}>Microsoft Corp.</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.stockPrice}>$418.10</Text>
                            <Text style={styles.stockChangePositive}>▲ 0.63%</Text>
                        </View>
                    </View>
                    <View style={styles.stockRow}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' }} style={styles.stockLogo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stockName}>MSFT</Text>
                            <Text style={styles.stockCompany}>Microsoft Corp.</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.stockPrice}>$418.10</Text>
                            <Text style={styles.stockChangePositive}>▲ 0.63%</Text>
                        </View>
                    </View>
                </View>
            </View>

        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 20,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 0,
        paddingTop: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -30,
    },
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
    rewardsButton: {
        backgroundColor: '#3d3d3d',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    rewardsText: {
        color: 'white',
        fontSize: 14,
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
        color: '#00FF7F',
        marginTop: 5,
        fontSize: 16,
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
        fontWeight: 'bold',
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
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#3D3D3D',
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
        alignItems: 'center',
    },
    assetTicker: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    assetAmount: {
        marginTop: 10,
        fontSize: 16,
    },
    assetChangePositive: {
        marginTop: 6,
        color: '#00FF7F',
        fontWeight: 'bold',
    },
    assetChangeNegative: {
        marginTop: 6,
        color: 'red',
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#e5e7eb',
        borderBottomWidth: 1,
    },
    stockLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
    },
    stockName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    stockCompany: {
        fontSize: 12,
        color: 'gray',
    },
    stockPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    stockChangePositive: {
        color: '#00FF7F',
        fontSize: 12,
    },
    stockChangeNegative: {
        color: 'red',
        fontSize: 12,
    },
});

export default Dashboard;
