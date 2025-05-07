import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native'; // Import Platform to check OS

export default function TabLayout() {
    
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarStyle: {
                    paddingBottom: Platform.OS === 'android' ? 10 : 0,
                    paddingTop: 5,
                    height: Platform.OS === 'android' ? 60 : 80,
                    justifyContent: 'center'
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('home'),
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <FontAwesome size={focused ? size + 3 : size} name="home" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: t('portfolio'),
                    tabBarIcon: ({ color, size, focused }) => (
                        <FontAwesome size={focused ? size + 3 : size} name="folder" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="stocks"
                options={{
                    title: t('stocks'),
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons size={focused ? size + 3 : size} name="table-chart" color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
