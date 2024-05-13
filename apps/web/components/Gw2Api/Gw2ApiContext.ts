import { createContext } from 'react';
import type { ErrorCode, Gw2AccountWithHidden } from './types';
import type { Scope } from '@gw2me/client';

export interface GetAccountsOptions {
  includeHidden?: boolean;
}

export interface Gw2ApiContext {
  getAccounts(requiredScopes: Scope[], optionalScopes?: Scope[], options?: GetAccountsOptions): Promise<Gw2AccountWithHidden[]>,
  setHidden(id: string, isHidden: boolean): void,
  error: ErrorCode | undefined,
  scopes: Scope[],
}

export const Gw2ApiContext = createContext<Gw2ApiContext>({
  getAccounts: () => Promise.resolve([]),
  setHidden: () => {},
  error: undefined,
  scopes: [],
});
