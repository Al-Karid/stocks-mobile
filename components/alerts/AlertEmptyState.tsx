import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const AlertEmptyState = () => {
  const { t } = useTranslation();

  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="mb-8">
        <View className="w-28 h-28 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
          <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
            <Feather name="bell-off" size={32} color="#d1d5db" />
          </View>
        </View>
      </View>
      <Text className="text-lg font-semibold text-gray-400 mb-2 text-center">
        {t("no-alerts-set-tap-the-button-to-add-one")}
      </Text>
    </View>
  );
};

export default AlertEmptyState;