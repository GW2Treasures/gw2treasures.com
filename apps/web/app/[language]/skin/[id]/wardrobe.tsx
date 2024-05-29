'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useUser } from '@/components/User/use-user';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import type { FC } from 'react';

interface WardrobeProps {
  skinId: number;
};

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const Wardrobe: FC<WardrobeProps> = ({ skinId }) => {
  const user = useUser();

  if(!user.loading && !user.user) {
    return null;
  }

  return (
    <>
      <Headline id="wardrobe">Wardrobe</Headline>
      <Gw2Accounts requiredScopes={requiredScopes} authorizationMessage="Authorize gw2treasures.com to see your account wardrobe.">
        {(accounts) => (
          <Table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Unlocked</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <th><Gw2AccountName account={account}/></th>
                  <AccountCell account={account} skinId={skinId}/>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Gw2Accounts>
    </>
  );
};

interface AccountCellProps {
  account: Gw2Account;
  skinId: number;
};

export const AccountCell: FC<AccountCellProps> = ({ account, skinId }) => {
  const unlockedSkins = useSubscription('skins', account.id);

  if(unlockedSkins.loading) {
    return (<td><Skeleton/></td>);
  }

  if(unlockedSkins.error) {
    return (<td style={{ color: 'var(--color-error)' }}>Error loading skin unlocks from Guild Wars 2 API</td>);
  }

  const unlocked = unlockedSkins.data.includes(skinId);

  return (
    <ProgressCell progress={unlocked ? 1 : 0}>
      <Icon icon={unlocked ? 'checkmark' : 'cancel'}/>
    </ProgressCell>
  );
};
