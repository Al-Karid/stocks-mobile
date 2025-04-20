import { Stack } from 'expo-router';

export default function StocksStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTitle: 'Stocks',
      }}
    />
  );
}
