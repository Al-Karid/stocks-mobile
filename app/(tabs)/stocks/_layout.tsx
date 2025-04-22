import { Stack } from 'expo-router';

export default function StocksStackLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Stocks",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="watchlist"
          options={{
            title: "Watchlist",
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </>
  );
}
