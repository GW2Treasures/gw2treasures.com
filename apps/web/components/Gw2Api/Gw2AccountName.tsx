import type { FC } from 'react';
import type { Gw2Account } from './types';

interface Gw2AccountNameProps {
  account: Gw2Account;
  long?: boolean;
};

export const Gw2AccountName: FC<Gw2AccountNameProps> = ({ account, long }) => {
  return (account.displayName ?? account.name) + ((long && account.displayName) ? ` (${account.name})` : '');
};
