import { AlertType } from '@/types/alerts';
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  title: string;
  description: string;
  time: string;
  type?: AlertType;
};

const NotificationCard = ({ title, description, time, type }: Props) => {
  const isGain = type === 'above';

  return (
    <View
      className="bg-white rounded-xl p-4 mb-3"
      // style={{
      //   shadowColor: '#000',
      //   shadowOffset: { width: 0, height: 2 },
      //   shadowOpacity: 0.03,
      //   shadowRadius: 8,
      //   elevation: 1,
      // }}
    >
      <View className="flex-row items-start gap-3">
        {/* Leading icon */}
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mt-0.5 ${
            isGain ? 'bg-emerald-50' : 'bg-rose-50'
          }`}
        >
          <Feather
            name={isGain ? 'trending-up' : 'trending-down'}
            size={18}
            color={isGain ? '#059669' : '#e11d48'}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Title row */}
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-semibold text-gray-900 flex-1 mr-2"
              numberOfLines={1}
            >
              {title}
            </Text>
            {/* {type && (
              <View
                className={`px-2 py-0.5 rounded-full ${
                  isGain ? 'bg-emerald-100' : 'bg-rose-100'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    isGain ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isGain ? '▲' : '▼'}
                </Text>
              </View>
            )} */}
          </View>

          {/* Description */}
          {description ? (
            <Text
              className="text-[13px] text-gray-500 mt-1 leading-[18px]"
              numberOfLines={3}
            >
              {description}
            </Text>
          ) : null}

          {/* Timestamp */}
          <Text className="text-[11px] text-gray-400 mt-2">{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;