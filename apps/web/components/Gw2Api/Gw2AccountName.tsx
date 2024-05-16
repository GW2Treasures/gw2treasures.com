import type { FC } from 'react';
import type { Gw2Account } from './types';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

interface Gw2AccountNameProps {
  account: Gw2Account;
  long?: boolean;
};

export const Gw2AccountName: FC<Gw2AccountNameProps> = ({ account, long }) => {
  // if the account does not have a displayName, always just return the name
  if(!account.displayName) {
    return account.name;
  }

  if(long) {
    return `${account.displayName} (${account.name})`;
  }

  return (
    <Tip tip={account.name}>
      <span>{account.displayName}</span>
    </Tip>
  );
};
