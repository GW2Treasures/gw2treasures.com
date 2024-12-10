import type { FC } from 'react';
import type { Gw2Account } from './types';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import commonStyles from '@gw2treasures/ui/common.module.css';

interface Gw2AccountNameProps {
  account: Gw2Account;
  long?: boolean;
}

export const Gw2AccountName: FC<Gw2AccountNameProps> = ({ account, long }) => {
  // if the account does not have a displayName, always just return the name
  if(!account.displayName) {
    return <span className={commonStyles.nowrap}>{account.name}</span>;
  }

  if(long) {
    return <span className={commonStyles.nowrap}>{account.displayName} ({account.name})</span>;
  }

  return (
    <Tip tip={account.name}>
      <span className={commonStyles.nowrap}>{account.displayName}</span>
    </Tip>
  );
};
