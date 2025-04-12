import * as Haptics from "expo-haptics";

export const provideHapticFeedback = () => {
  if (process.env.EXPO_OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};
