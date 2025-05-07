import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PortfolioStackLayout() {
  
  const { t } = useTranslation();
  
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: t('portfolio'),
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="holdings"
          options={{
            title: t('holdings'),
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </>
  );
}
