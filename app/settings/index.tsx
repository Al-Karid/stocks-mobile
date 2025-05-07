import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    Switch,
} from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Collapsible from 'react-native-collapsible';
import { useUserStore } from '@/stores/userStore';
import { useAlertStore } from '@/stores/alertStore';
import { NotificationChannel } from '@/types/settings';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {

    const { t } = useTranslation();
    const {notificationChannels, updateNotificationChannel } = useAlertStore();
    
    const [collapsed, setCollapsed] = useState(true);
    const { user, loggedIn, removeUser } = useUserStore();
    const canLogin = false

    const isRegistered = loggedIn && user !== null;

    const handleLogout = () => removeUser();
    const handleAlertSettings = () => console.log("Alert Settings pressed");

    const handleDeleteAccount = () => {
        Alert.alert(
            t('delete-account'),
            t('are-you-sure-you-want-to-delete-your-account-this-action-cannot-be-undone'),
            [
                { text: t('cancel'), style: "cancel" },
                { text: t('delete'), style: "destructive", onPress: () => handleLogout() },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
            {/* Section 1: Account */}
            <View>
                {/* <Text style={styles.sectionTitle}>Account</Text> */}

                <View style={styles.card}>

                    {isRegistered && (
                        <TouchableOpacity style={styles.row} onPress={() => setCollapsed(!collapsed)} disabled>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                            <Text style={styles.text}>{user?.name}</Text>
                            <Ionicons
                                name={collapsed ? 'chevron-forward-outline' : 'chevron-up-outline'}
                                size={18}
                                color="#ccc"
                                style={styles.chevron}
                            />
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <Collapsible style={styles.detailsBox} collapsed={collapsed}>
                            <Text style={[styles.row]}>Username: {user.username}</Text>
                            <Text style={styles.row}>{t('display-name')} {user.name}</Text>
                            <Text style={[styles.row]}>Phone: {user.phone}</Text>
                            <TouchableOpacity style={styles.blackButton} onPress={() => console.log("Edit pressed")}>
                                <Ionicons name="create-outline" size={20} color="#fff" style={styles.icon} />
                                <Text style={styles.blackButtonText}>{t('edit')}</Text>
                            </TouchableOpacity>
                        </Collapsible>
                    )}

                    {canLogin && (
                        <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/login')}>
                            <Ionicons name="log-in-outline" size={20} color="#666" style={styles.icon} />
                            <Text style={styles.text}>{t('login')}</Text>
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/register')}>
                            <Ionicons name="person-add" size={20} color="#666" style={styles.icon} />
                            <Text style={styles.text}>{t('register')}</Text>
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <TouchableOpacity style={[styles.row, styles.lastRow]} onPress={handleDeleteAccount}>
                            <Ionicons name="log-out-outline" size={20} color="#666" style={styles.icon} />
                            <Text style={[styles.text, { color: 'red' }]}>{t('delete-my-account')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Section 2: Alerts */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('alerts')}</Text>
                
                {/* <Text style={styles.sectionSubtitle}>Canaux de notification</Text> */}
                <View style={[styles.card, { marginBottom: 12 }]}>
                    <TouchableOpacity style={[styles.row, styles.row]} onPress={handleAlertSettings}>
                        <Entypo name="notification" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>{t('push-channel')}</Text>
                        {
                            Platform.OS === "ios" ? (
                                <Switch
                                    value={notificationChannels?.push || false}
                                    onValueChange={() => {updateNotificationChannel('push')}}
                                    style={[styles.chevron]}
                                    disabled={true}
                                />
                            ) : (
                                <Switch
                                    value={notificationChannels?.push || false}
                                    onValueChange={() => {updateNotificationChannel('push')}}
                                    // trackColor={{ false: '#ccc', true: '#000' }}
                                    style={[styles.chevron]}
                                    disabled={true}
                                // thumbColor={item.enabled ? '#000' : '#f4f3f4'}
                                />
                            )
                        }
                        {/* <Ionicons name="chevron-forward-outline" size={18} color="#ccc" style={styles.chevron} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.lastRow]} onPress={handleAlertSettings}>
                        <MaterialIcons name="sms" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>{t('sms-channel')}</Text>
                        {
                            Platform.OS === "ios" ? (
                                <Switch
                                    value={notificationChannels?.sms || false}
                                    onValueChange={() => {updateNotificationChannel('sms')}}
                                    style={[styles.chevron]}
                                    disabled={true}
                                />
                            ) : (
                                <Switch
                                    value={notificationChannels?.sms || false}
                                    onValueChange={() => {updateNotificationChannel('sms')}}
                                    // trackColor={{ false: '#ccc', true: '#000' }}
                                    style={[styles.chevron]}
                                    disabled={true}
                                    
                                // thumbColor={item.enabled ? '#000' : '#f4f3f4'}
                                />
                            )
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <TouchableOpacity style={[styles.row, styles.lastRow]} onPress={() => router.push('/alerts')}>
                        <Ionicons name="notifications-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.text}>{t('manage-alerts')}</Text>
                        <Ionicons name="chevron-forward-outline" size={18} color="#ccc" style={styles.chevron} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 3: About */}
            <View style={styles.creditsContainer}>
                <Text style={styles.creditsText}>
                    {t('c-2025-revalys-data-services')}
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
    sectionSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 8,
        color: '#999',
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
