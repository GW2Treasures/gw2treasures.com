import { createContext } from 'react';
import type { ErrorCode, Gw2Account } from './types';

export interface Gw2ApiContext {
  getAccounts(): Promise<Gw2Account[]>,
  error: ErrorCode | undefined,
}

export const Gw2ApiContext = createContext<Gw2ApiContext>({
  getAccounts: () => Promise.resolve([]),
  error: undefined,
});
