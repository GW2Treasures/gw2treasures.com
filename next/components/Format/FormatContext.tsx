'use client';

import { useHydrated } from 'lib/useHydrated';
import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const defaultLocale = new Intl.NumberFormat(undefined).resolvedOptions().locale;

interface FormatContextProps {
  locale: string | undefined;
  setLocale: (locale: string | undefined) => void;
  defaultLocale: string;

  utcFormat: Intl.DateTimeFormat;
  localFormat: Intl.DateTimeFormat;
  relativeFormat: Intl.RelativeTimeFormat;
  numberFormat: Intl.NumberFormat;
}

const FormatContext = createContext<FormatContextProps>(null!);

export function useFormatContext() { return useContext(FormatContext); }

export interface FormatProviderProps {
  children: ReactNode;
}

export const FormatProvider: FC<FormatProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<string | undefined>();
  const hydrated = useHydrated();

  // load locale from localstorage
  useEffect(() => setLocale(localStorage['gw2t.locale']), []);

  // save locale to localStorage if it changes after hydration
  useEffect(() => {
    if(!hydrated) {
      return;
    }

    locale
      ? localStorage.setItem('gw2t.locale', locale)
      : localStorage.removeItem('gw2t.locale');
  }, [hydrated, locale]);

  const context = useMemo(() => ({
    locale, setLocale, defaultLocale,
    utcFormat: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' }),
    localFormat: new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }),
    relativeFormat: new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
    numberFormat: new Intl.NumberFormat(locale, { useGrouping: true }),
  }), [locale, setLocale]);

  return <FormatContext.Provider value={context}>{children}</FormatContext.Provider>;
};
