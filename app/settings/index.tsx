import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Collapsible from 'react-native-collapsible';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
    const [collapsed, setCollapsed] = useState(true);

    const handleLogout = () => console.log("Logout pressed");
    const handleAlertSettings = () => console.log("Alert Settings pressed");

    return (
        <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
            {/* Section 1: Account */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => setCollapsed(!collapsed)}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>Al-karid</Text>
                        <Ionicons
                            name={collapsed ? 'chevron-forward-outline' : 'chevron-up-outline'}
                            size={18}
                            color="#ccc"
                            style={styles.chevron}
                        />
                    </TouchableOpacity>


                    <Collapsible style={styles.detailsBox} collapsed={collapsed}>
                        <Text style={[styles.row]}>Username: alkarid_2025</Text>
                        <Text style={styles.row}>Display Name: Al-karid</Text>
                        <Text style={[styles.row]}>Phone: +225 0707070707</Text>
                        <TouchableOpacity style={styles.blackButton} onPress={() => console.log("Edit pressed")}>
                            <Ionicons name="create-outline" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.blackButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </Collapsible>


                    <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/login')}>
                        <Ionicons name="log-in-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/register')}>
                        <Ionicons name="person-add" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.row, styles.lastRow]} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={[styles.text, { color: 'red' }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 2: Alerts */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alerts</Text>

                <View style={styles.card}>
                    <TouchableOpacity style={[styles.row, styles.lastRow]} onPress={handleAlertSettings}>
                        <Ionicons name="notifications-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>Manage Alerts</Text>
                        <Ionicons name="chevron-forward-outline" size={18} color="#ccc" style={styles.chevron} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 3: About */}
            <View style={styles.creditsContainer}>
                <Text style={styles.creditsText}>
                    © 2025 Revalys Data Services
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#444',
        paddingLeft: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 12,
    },
    chevron: {
        marginLeft: 'auto',
    },
    detailsBox: {
        paddingVertical: 0,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    creditsContainer: {
        marginTop: 32,
        alignItems: 'center',
        paddingBottom: 24,
    },
    creditsText: {
        fontSize: 12,
        color: '#999',
    },
    blackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 12,
    },

    blackButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
