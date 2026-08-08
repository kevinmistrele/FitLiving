import en from '@/i18n/en.json';
import { mergeFeatureMessages } from '@/i18n/feature-registry';
import pt from '@/i18n/pt.json';

export type SupportedLocale = 'en' | 'pt';

export const messages: Record<SupportedLocale, Record<string, string>> = {
  en: { ...en, ...mergeFeatureMessages('en') },
  pt: { ...pt, ...mergeFeatureMessages('pt') },
};

export const supportedLocales: SupportedLocale[] = ['en', 'pt'];

export const defaultLocale: SupportedLocale = 'en';
