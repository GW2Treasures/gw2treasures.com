import { createContext } from 'react';
import type { ErrorCode, Gw2Account } from './types';
import type { Scope } from '@gw2me/client';

export interface Gw2ApiContext {
  getAccounts(requiredScopes: Scope[]): Promise<Gw2Account[]>,
  error: ErrorCode | undefined,
  scopes: Scope[],
}

export const Gw2ApiContext = createContext<Gw2ApiContext>({
  getAccounts: () => Promise.resolve([]),
  error: undefined,
  scopes: [],
});
