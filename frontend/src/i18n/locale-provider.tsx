import { type PropsWithChildren, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { LocaleContext } from '@/i18n/locale-context';
import { defaultLocale, messages, supportedLocales, type SupportedLocale } from '@/i18n/index';

const LOCALE_STORAGE_KEY = 'locale';

function isSupportedLocale(value: string | null): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

function resolveInitialLocale(): SupportedLocale {
  if (typeof window === 'undefined') return defaultLocale;

  const queryLocale = new URLSearchParams(window.location.search).get('locale');
  if (isSupportedLocale(queryLocale)) return queryLocale;

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isSupportedLocale(storedLocale)) return storedLocale;

  const browserLocale = window.navigator.language.slice(0, 2);
  if (isSupportedLocale(browserLocale)) return browserLocale;

  return defaultLocale;
}

export function LocaleProvider(props: PropsWithChildren) {
  const { children } = props;
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(resolveInitialLocale);

  const contextValue = useMemo(
    () => ({
      currentLocale,
      changeLocale: (locale: SupportedLocale) => {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        setCurrentLocale(locale);
      },
    }),
    [currentLocale],
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider
        locale={currentLocale}
        messages={messages[currentLocale]}
        defaultLocale={defaultLocale}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
