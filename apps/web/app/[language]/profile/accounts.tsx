import { fetchAccounts } from '@/components/Gw2Api/fetch-accounts-action';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { List } from '@gw2treasures/ui/components/Layout/List';
import type { FC } from 'react';

export interface AccountsProps { }

export const Accounts: FC<AccountsProps> = async ({}) => {
  const accounts = await fetchAccounts([]);

  return (
    <>
      {accounts.error !== undefined ? (
        <form action={reauthorize.bind(null, [], undefined)}>
          <p>Authorize gw2treasures.com to view your progress.</p>
          <FlexRow>
            <SubmitButton type="submit" icon="gw2me-outline">Authorize</SubmitButton>
          </FlexRow>
        </form>
      ) : (
        <form action={reauthorize.bind(null, [], 'consent')}>
          <p>gw2treasures.com is authorized to view your progress of these accounts.</p>
          <List>
            {accounts.accounts.map((account) => (
              <li key={account.name}>{account.name}</li>
            ))}
          </List>

          <FlexRow>
            <SubmitButton type="submit" icon="gw2me-outline">Manage Accounts</SubmitButton>
          </FlexRow>
        </form>
      )}
    </>
  );
};
