import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: 'Portfolio',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="folder" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="stocks"
                options={{
                    title: 'Stocks',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="table-chart" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
