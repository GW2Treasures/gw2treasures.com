import { createContext } from 'react';

export interface Gw2ApiContext {
  accounts: {
    name: string;
    subtoken: string;
  }[]
}

export const Gw2ApiContext = createContext<Gw2ApiContext>({ accounts: [] });
