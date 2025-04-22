import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => <FontAwesome
                        size={focused ? size + 3 : size}
                        name="home" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: 'Portfolio',
                    tabBarIcon: ({ color, size, focused }) => <FontAwesome
                        size={focused ? size + 3 : size}
                        name="folder" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="stocks"
                options={{
                    title: 'Stocks',
                    tabBarIcon: ({ color, size, focused }) => <MaterialIcons 
                    size={focused ? size + 3 : size} 
                    name="table-chart" color={color} />,
                    tabBarIconStyle: { marginTop: 5 },
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
