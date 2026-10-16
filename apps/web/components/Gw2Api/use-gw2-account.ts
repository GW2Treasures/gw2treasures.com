import { use } from 'react';
import { Gw2AccountContext } from './Gw2AccountContext';
import type { Gw2Account } from './types';

/** Get the account provided by the closest `Gw2AccountBodyCells` or `Gw2AccountContext` */
export function useGw2Account(): Gw2Account {
  const account = use(Gw2AccountContext);

  if(!account) {
    throw new Error('useGw2Account must be used inside a Gw2AccountContext');
  }

  return account;
}
