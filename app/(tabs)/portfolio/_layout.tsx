import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

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
          options={Platform.select({
            android: {
              title: t("holdings"),
            },
            ios: {
              title: t("holdings"),
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            },
          })}
        />
      </Stack>
    </>
  );
}
