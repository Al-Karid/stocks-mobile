import { User } from "./user";

export interface SettingData {
  key: string;
  value: string;
}

export interface NotificationChannel {
  push: boolean;
  sms: boolean;
}

export type UserProfileType = 'free' | 'premium' 
export interface UserProfileSettings {
  userProfile: UserProfileType;
  maxPorfolio: number;
  maxWatchlist: number;
  maxTransactions: number;
  maxAlerts: number;
}