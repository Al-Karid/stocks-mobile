import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticButtonProps {
  onLongPress?: (event: any) => void;
  onPress?: (event: any) => void;
  style?: object;
  children?: React.ReactNode;
}

export function HapticButtonLongPress(props: HapticButtonProps) {
  return (
    <Pressable
      {...props}
      onLongPress={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onLongPress?.(ev);
      }}
    >
      {props.children}
    </Pressable>
  );
}
