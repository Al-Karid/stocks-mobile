import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs iconColor={{ default: "#8e8e93", selected: "#000000" }}>
      <NativeTabs.Trigger name="index">
        <Icon src={<VectorIcon family={FontAwesome} name="home" />} />
        <Label>{t("home")}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="portfolio">
        <Icon src={<VectorIcon family={FontAwesome} name="folder" />} />
        <Label>{t("portfolio")}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stocks">
        <Icon src={<VectorIcon family={MaterialIcons} name="table-chart" />} />
        <Label>{t("stocks")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
