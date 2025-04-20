import { Stack } from 'expo-router';

export default function PortfolioStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTitle: 'Portfolio',
      }}
    />
  );
}
