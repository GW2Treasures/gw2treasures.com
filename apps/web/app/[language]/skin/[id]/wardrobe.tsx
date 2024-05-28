'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useUser } from '@/components/User/use-user';
import { Scope } from '@gw2me/client';
import { Icon } from '@gw2treasures/ui';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import type { FC } from 'react';

interface WardrobeProps {
  skinId: number;
};

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Unlocks];

export const Wardrobe: FC<WardrobeProps> = ({ skinId }) => {
  const user = useUser();
  const accounts = useGw2Accounts(requiredScopes);

  if(!user.loading && !user.user) {
    return null;
  }

  return (
    <>
      <Headline id="wardrobe">Wardrobe</Headline>
      {accounts.loading ? (
        <Skeleton/>
      ) : accounts.error ? (
        <Notice type="error">Error loading your accounts from the Guild Wars 2 API.</Notice>
      ) : requiredScopes.some((scope) => !accounts.scopes.includes(scope)) ? (
        <form action={reauthorize.bind(null, requiredScopes, undefined)}>
          <Notice>
            <FlexRow wrap>
              Authorize gw2treasures.com to see your account wardrobe.
              <SubmitButton type="submit" icon="gw2me-outline" appearance="tertiary">Authorize</SubmitButton>
            </FlexRow>
          </Notice>
        </form>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Unlocked</th>
            </tr>
          </thead>
          <tbody>
            {accounts.accounts.map((account) => (
              <tr key={account.id}>
                <th><Gw2AccountName account={account}/></th>
                <AccountCell account={account} skinId={skinId}/>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
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
