import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { paddingVertical: 10 }, // Added padding to tabs
      }}
    >
      <Tabs.Screen 
        name="(portfolio)" 
        options={{ 
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="stocks" 
        options={{ 
          title: "Stocks",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="font-awesome" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}