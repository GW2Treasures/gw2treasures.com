import 'server-only';

import { type FC, type ReactNode } from 'react';
import { I18nProvider as ContextProvider } from './Context';
import type { Language } from '@gw2treasures/database';

export interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children, language }) => {
  return (
    <ContextProvider language={language}>{children}</ContextProvider>
  );
};
