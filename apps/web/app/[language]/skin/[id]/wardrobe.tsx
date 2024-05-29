'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { SkinAccountUnlockCell } from '@/components/Skin/SkinAccountUnlockCell';
import { useUser } from '@/components/User/use-user';
import { Scope } from '@gw2me/client';
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
                  <SkinAccountUnlockCell accountId={account.id} skinId={skinId}/>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Gw2Accounts>
    </>
  );
};
