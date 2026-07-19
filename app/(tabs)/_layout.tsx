import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs iconColor={{ default: "#8e8e93", selected: "#000000" }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={FontAwesome} name="home" />} />
        <NativeTabs.Trigger.Label>{t("home")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="portfolio">
        <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={FontAwesome} name="folder" />} />
        <NativeTabs.Trigger.Label>{t("portfolio")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stocks">
        <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="table-chart" />} />
        <NativeTabs.Trigger.Label>BRMV</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
