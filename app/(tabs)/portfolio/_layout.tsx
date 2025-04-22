import { Stack } from 'expo-router';

export default function PortfolioStackLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Portfolio",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="holdings"
          options={{
            title: "Holdings",
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </>
  );
}
