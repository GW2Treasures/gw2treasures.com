import { createContext } from 'react';
import type { Gw2Account } from './types';

export interface Gw2ApiContext {
  getAccounts(): Promise<Gw2Account[]>
}

export const Gw2ApiContext = createContext<Gw2ApiContext>({
  getAccounts: () => Promise.resolve([])
});
