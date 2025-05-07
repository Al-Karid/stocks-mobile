// languageHelper.ts
import i18n from '@/i18n';

export const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
};
