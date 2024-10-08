'use client';

import { useHydrated } from '@/lib/useHydrated';
import { createContext, type FC, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../I18n/Context';

const defaultLocale = new Intl.NumberFormat(undefined).resolvedOptions().locale;
const defaultRegion = getDefaultRegion();

function getDefaultRegion() {
  if(typeof window === 'undefined') {
    return 'US';
  }

  const localeWithRegionRegex = /^[a-z]{2,4}([_-][a-z]{4})?[_-]([a-z]{2,3})/i;

  const localeWithRegionMatch = [defaultLocale, ...navigator.languages]
    .map((locale) => locale.match(localeWithRegionRegex))
    .find((match) => match !== null);

  return localeWithRegionMatch ? localeWithRegionMatch[2] : 'US';
}

interface FormatContextProps {
  language: string;
  region: string;
  locale: string;
  setLocale: (language: string | 'auto', region: string) => void;
  defaultLocale: string;
  defaultRegion: string;

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
  const currentLanguage = useLanguage();
  const [region, setRegion] = useState<string>('browser');
  const [language, setLanguage] = useState<string>('auto');

  const hydrated = useHydrated();

  // load locale from localStorage
  useEffect(() => {
    if(localStorage['gw2t.format.region']) {
      setRegion(localStorage['gw2t.format.region']);
    }
    if(localStorage['gw2t.format.language']) {
      setLanguage(localStorage['gw2t.format.language']);
    }
  }, []);

  // save locale to localStorage if it changes after hydration
  useEffect(() => {
    if(!hydrated) {
      return;
    }

    localStorage.setItem('gw2t.format.region', region);
    localStorage.setItem('gw2t.format.language', language);
  }, [hydrated, region, language]);

  // build locale with language and region and validate it
  const customLocale = `${language === 'auto' ? currentLanguage : language}-${region === 'browser' ? defaultRegion : region}`;
  const locale = Intl.DateTimeFormat.supportedLocalesOf([customLocale, defaultLocale])[0];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // create context
  const context: FormatContextProps = useMemo(() => ({
    language, region, locale, setLocale: (language, region) => { setLanguage(language); setRegion(region); }, defaultLocale, defaultRegion,
    utcFormat: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' }),
    localFormat: new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }),
    relativeFormat: new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
    numberFormat: new Intl.NumberFormat(locale, { useGrouping: true }),
  }), [language, region, locale]);

  return <FormatContext.Provider value={context}>{children}</FormatContext.Provider>;
};
