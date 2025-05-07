// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import fr from './locales/fr.json';

const fallbackLng = 'en';

// Charger langue sauvegardée dans AsyncStorage ou SecureStore si besoin
// Pour simplifier ici, on prend celle de l'appareil
const defaultLng = Localization.locale.split('-')[0]; // 'fr' from 'fr-FR'

i18n
  .use(initReactI18next)
  .init({
    lng: defaultLng,
    fallbackLng,
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
