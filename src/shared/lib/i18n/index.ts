import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import { languageResources } from './resources';

const LANGUAGE_STORAGE_KEY = '@toolKit/i18n-language';

export const supportedLanguages = ['en', 'ko'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = languageResources;

const getDeviceLanguage = (): SupportedLanguage => {
  try {
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      const languageCode = locales[0].languageCode;
      if (supportedLanguages.includes(languageCode as SupportedLanguage)) {
        return languageCode as SupportedLanguage;
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to get device language:', error);
    }
  }
  return 'en';
};

// 초기 언어를 동기적으로 감지하여 설정
const initialLanguage = getDeviceLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export const loadSavedLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && supportedLanguages.includes(savedLanguage as SupportedLanguage)) {
      return savedLanguage as SupportedLanguage;
    }
    return getDeviceLanguage();
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to load saved language:', error);
    }
    return getDeviceLanguage();
  }
};

export const saveLanguagePreference = async (language: SupportedLanguage): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to save language preference:', error);
    }
  }
};

export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await saveLanguagePreference(language);
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = (): SupportedLanguage => {
  const current = i18n.language as SupportedLanguage | undefined;
  if (current && supportedLanguages.includes(current)) {
    return current;
  }
  return 'en';
};

void (async () => {
  const language = await loadSavedLanguage();
  await changeLanguage(language);
})();

export { i18n };
