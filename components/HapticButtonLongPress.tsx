import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

interface HapticButtonProps {
  onLongPress?: (event: any) => void;
  style?: object;
  children?: React.ReactNode;
}

export function HapticButtonLongPress(props: HapticButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onLongPress={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onLongPress?.(ev);
      }}
    >
      {props.children}
    </PlatformPressable>
  );
}
