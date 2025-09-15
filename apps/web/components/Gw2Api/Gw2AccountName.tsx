import type { FC } from 'react';
import type { Gw2Account } from './types';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import commonStyles from '@gw2treasures/ui/common.module.css';
import { Icon } from '@gw2treasures/ui';

interface Gw2AccountNameProps {
  account: Gw2Account,
  long?: boolean,
}

export const Gw2AccountName: FC<Gw2AccountNameProps> = ({ account, long }) => {
  const shared = account.shared
    ? <Tip tip="Shared Account"><Icon icon="share"/></Tip>
    : null;

  // if the account does not have a displayName, always just return the name
  if(!account.displayName) {
    return <span className={commonStyles.nowrap}>{account.name} {shared}</span>;
  }

  if(long) {
    return <span className={commonStyles.nowrap}>{account.displayName} ({account.name}) {shared}</span>;
  }

  return (
    <Tip tip={account.shared ? `${account.name} (Shared account)` : account.name}>
      <span className={commonStyles.nowrap}>{account.displayName} {account.shared && <Icon icon="share"/>}</span>
    </Tip>
  );
};
