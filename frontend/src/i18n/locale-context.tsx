import { createContext } from 'react';

import type { SupportedLocale } from '@/i18n/index';

export interface LocaleContextValue {
  currentLocale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);
