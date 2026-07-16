import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Collapsible from 'react-native-collapsible';
import { useUserStore } from '@/stores/userStore';
import { useAlertStore } from '@/stores/alertStore';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';

export default function SettingsScreen() {

    const { t } = useTranslation();
    const { notificationChannels, updateNotificationChannel } = useAlertStore();
    const { autoUpdatesEnabled, setAutoUpdatesEnabled, fetchAutoUpdatesEnabled, biometricsEnabled, setBiometricsEnabled, fetchBiometricsEnabled } = useSettingsStore();
    const { isCompatible, isEnrolled } = useBiometricAuth();

    const [collapsed, setCollapsed] = useState(true);
    const { user, loggedIn, removeUser } = useUserStore();
    const canLogin = false;

    const isRegistered = loggedIn && user !== null;

    useEffect(() => {
        fetchAutoUpdatesEnabled();
        fetchBiometricsEnabled();
    }, [fetchAutoUpdatesEnabled, fetchBiometricsEnabled]);

    const handleLogout = () => removeUser();

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
        <ScrollView
            className="flex-1 bg-[#f2f2f2] px-4"
            contentInsetAdjustmentBehavior="automatic"
        >
            {/* Section 1: Account */}
            <View>
                <View className="bg-white rounded-xl overflow-hidden">

                    {isRegistered && (
                        <TouchableOpacity
                            className="flex-row items-center py-3.5 px-4 border-b border-gray-100"
                            onPress={() => setCollapsed(!collapsed)}
                            disabled
                        >
                            <Ionicons name="person-outline" size={20} color="#666" className="mr-3" />
                            <Text className="text-base text-gray-700">{user?.name}</Text>
                            <Ionicons
                                name={collapsed ? 'chevron-forward-outline' : 'chevron-up-outline'}
                                size={18}
                                color="#ccc"
                                className="ml-auto"
                            />
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <Collapsible style={{ paddingVertical: 0, paddingHorizontal: 20, backgroundColor: '#f9f9f9', borderTopWidth: 1, borderTopColor: '#eee' }} collapsed={collapsed}>
                            <Text className="py-2 text-sm text-gray-500">Username: {user.username}</Text>
                            <Text className="py-2 text-sm text-gray-500">{t('display-name')} {user.name}</Text>
                            <Text className="py-2 text-sm text-gray-500">Phone: {user.phone}</Text>
                            <TouchableOpacity
                                className="flex-row items-center justify-center bg-black py-3 px-4 rounded-lg my-3"
                                onPress={() => console.log("Edit pressed")}
                            >
                                <Ionicons name="create-outline" size={20} color="#fff" className="mr-3" />
                                <Text className="text-white text-base font-medium">{t('edit')}</Text>
                            </TouchableOpacity>
                        </Collapsible>
                    )}

                    {canLogin && (
                        <TouchableOpacity
                            className="flex-row items-center py-3.5 px-4 border-b border-gray-100"
                            onPress={() => router.push('/settings/login')}
                        >
                            <Ionicons name="log-in-outline" size={20} color="#666" className="mr-3" />
                            <Text className="text-base text-gray-700">{t('login')}</Text>
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <TouchableOpacity
                            className="flex-row items-center py-3.5 px-4 border-b border-gray-100"
                            onPress={() => router.push('/settings/register')}
                        >
                            <Ionicons name="person-add" size={20} color="#666" className="mr-3" />
                            <Text className="text-base text-gray-700">{t('register')}</Text>
                        </TouchableOpacity>
                    )}

                    {isRegistered && (
                        <TouchableOpacity
                            className="flex-row items-center py-3.5 px-4"
                            onPress={handleDeleteAccount}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#666" className="mr-3" />
                            <Text className="text-base text-red-500">{t('delete-my-account')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Section 2: Updates */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-2 text-gray-600 pl-1">Updates</Text>
                <View className="bg-white rounded-xl overflow-hidden">
                    <View className="flex-row items-center py-3.5 px-4">
                        <Ionicons name="cloud-download-outline" size={20} color="#666" className="mr-3" />
                        <Text className="text-base text-gray-700">Auto update</Text>
                        <Switch
                            value={autoUpdatesEnabled}
                            onValueChange={(value) => setAutoUpdatesEnabled(value)}
                            className="ml-auto"
                        />
                    </View>
                </View>
            </View>

            {/* Section 3: Security */}
            {((isCompatible && isEnrolled) || __DEV__) && (
                <View className="mt-8">
                    <Text className="text-base font-bold mb-2 text-gray-600 pl-1">{t('security')}</Text>
                    <View className="bg-white rounded-xl overflow-hidden">
                        <View className="flex-row items-center py-3.5 px-4">
                            <Ionicons name="finger-print-outline" size={20} color="#666" className="mr-3" />
                            <Text className="text-base text-gray-700">{t('biometric-lock')}</Text>
                            <Switch
                                value={biometricsEnabled}
                                onValueChange={(value) => setBiometricsEnabled(value)}
                                className="ml-auto"
                            />
                        </View>
                    </View>
                </View>
            )}

            {/* Section 4: Alerts */}
            <View className="mt-8">
                <Text className="text-base font-bold mb-2 text-gray-600 pl-1">{t('alerts')}</Text>

                <View className="bg-white rounded-xl overflow-hidden">
                    <View className="flex-row items-center py-3.5 px-4 border-b border-gray-100">
                        <Entypo name="notification" size={20} color="#666" className="mr-3" />
                        <Text className="text-base text-gray-700">{t('push-channel')}</Text>
                        <Switch
                            value={notificationChannels?.push || false}
                            onValueChange={() => { updateNotificationChannel('push'); }}
                            className="ml-auto"
                            disabled={true}
                        />
                    </View>
                    <View className="flex-row items-center py-3.5 px-4 border-b border-gray-100">
                        <MaterialIcons name="sms" size={20} color="#666" className="mr-3" />
                        <Text className="text-base text-gray-700">{t('sms-channel')}</Text>
                        <Switch
                            value={notificationChannels?.sms || false}
                            onValueChange={() => { updateNotificationChannel('sms'); }}
                            className="ml-auto"
                            disabled={true}
                        />
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center py-4 px-4"
                        onPress={() => router.push('/alerts')}
                    >
                        <Ionicons name="notifications-outline" size={20} color="#666" className="mr-3" />
                        <Text className="text-base text-gray-700">{t('manage-alerts')}</Text>
                        <Ionicons name="chevron-forward-outline" size={18} color="#ccc" className="ml-auto" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 5: About */}
            <View className="mt-8 items-center pb-6">
                <Text className="text-xs text-gray-400">
                    {t('c-2025-revalys-data-services')}
                </Text>
            </View>
        </ScrollView>
    );
}