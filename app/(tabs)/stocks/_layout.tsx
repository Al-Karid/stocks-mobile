import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function StocksStackLayout() {

  const { t } = useTranslation();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: t('stocks'),
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="watchlist"
          options={{
            title: t('watchlist'),
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
            name="palmares"
            options={{
              title: t('palmares'),
              headerLargeTitle: true,
            }}
          />
      </Stack>
    </>
  );
}
