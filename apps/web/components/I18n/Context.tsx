'use client';

import { Language } from '@prisma/client';
import { createContext, FC, ReactNode, useContext } from 'react';

interface I18nContext {
  language: Language;
}

export const I18nContext = createContext<I18nContext>({ language: 'en' });

export function useLanguage() {
  const { language } = useContext(I18nContext);

  return language;
}

export interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children, language }) => {
  return <I18nContext.Provider value={{ language }}>{children}</I18nContext.Provider>;
};
