import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function PortfolioStackLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: t("portfolio"),
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="holdings"
          options={{
            title: t("holdings"),
            headerLargeTitle: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="choose-stock"
          options={{
            title: "Choose Stock",
            presentation: "formSheet",
            sheetGrabberVisible: true,
            contentStyle: { backgroundColor: 'transparent' },
            headerStyle: { backgroundColor: 'transparent' },
            sheetAllowedDetents: [0.7, 1],
            sheetInitialDetentIndex: 0,
            sheetLargestUndimmedDetentIndex: -1,
          }}
        />
      </Stack>
    </>
  );
}
