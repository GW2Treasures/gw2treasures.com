import 'server-only';

import { FC, ReactNode } from 'react';
import { I18nProvider as ContextProvider } from './Context';
import { getLanguage } from './getLanguage';

export interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children }) => {
  const language = getLanguage();

  return (
    <ContextProvider language={language}>{children}</ContextProvider>
  );
};
