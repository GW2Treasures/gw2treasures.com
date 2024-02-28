'use client';

import { FormatDate } from '@/components/Format/FormatDate';
import { Gw2ApiContext } from '@/components/Gw2Api/Gw2ApiContext';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { useGw2Api } from '@/components/Gw2Api/use-gw2-api';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useUser } from '@/components/User/use-user';
import { Icon } from '@gw2treasures/ui';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';
import { useState, type FC, type ReactNode, useContext, useEffect, Fragment } from 'react';

export interface WizardVaultObjectivesProps {
}

const EMPTY_ACCOUNTS: never[] = [];

export const WizardVaultObjectives: FC<WizardVaultObjectivesProps> = ({ }) => {
  const user = useUser();
  const [accounts, setAccounts] = useState<AccountWizardsVaultData[]>(EMPTY_ACCOUNTS);
  const { getAccounts, error } = useContext(Gw2ApiContext);

  useEffect(() => {
    if (user.user) {
      getAccounts().then((accounts) => Promise.all(accounts.map(({ subtoken }) => loadAccountsWizardsVault(subtoken)))).then(setAccounts);
    } else {
      setAccounts(EMPTY_ACCOUNTS);
    }
  }, [getAccounts, user.user]);

  if(user.loading) {
    return <Skeleton/>;
  }

  if(!user.user) {
    return (
      <p><Link href="/login">Login</Link> to see your personal Wizard&apos; Vault objectives.</p>
    );
  }

  if(error) {
    return (
      <form action={reauthorize}>
        <p>Authorize gw2treasures.com to view your objectives.</p>
        <FlexRow>
          <SubmitButton type="submit" icon="gw2me-outline">Authorize</SubmitButton>
        </FlexRow>
      </form>
    );
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Daily</th>
            <th>Weekly</th>
            <th>Special</th>
            {/* <th>Astral Acclaim</th> */}
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.account.id}>
              <td>{account.account.name}</td>
              <td>{account.daily ? `${account.daily.meta_progress_current}/${account.daily.meta_progress_complete}` : 0 }</td>
              <td>{account.weekly ? `${account.weekly.meta_progress_current}/${account.weekly.meta_progress_complete}` : 0 }</td>
              <td>{account.special ? `${account.special.objectives.filter(({ claimed }) => claimed).length}/${account.special.objectives.length}` : 0}</td>
              {/* <td>{account.acclaim}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      {accounts.map((account) => (
        <Fragment key={account.account.id}>
          <Headline id={account.account.id}>{account.account.name}</Headline>
          {!account.lastModifedToday && <Notice>This account has not logged since the last reset. Not all objectives can be shown and special objectives may be outdated.</Notice>}

          <Table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Track</th>
                <th>Objective</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {account.daily?.objectives.map((objective) => (
                <tr key={objective.id}>
                  <td>Daily</td>
                  <td>{objective.track}</td>
                  <td>{objective.title}</td>
                  <td>{objective.progress_current}/{objective.progress_complete} {objective.claimed && <Icon icon="checkmark"/>}</td>
                </tr>
              ))}
              {account.weekly?.objectives.map((objective) => (
                <tr key={objective.id}>
                  <td>Weekly</td>
                  <td>{objective.track}</td>
                  <td>{objective.title}</td>
                  <td>{objective.progress_current}/{objective.progress_complete} {objective.claimed && <Icon icon="checkmark"/>}</td>
                </tr>
              ))}
              {account.special?.objectives.map((objective) => (
                <tr key={objective.id}>
                  <td>Special</td>
                  <td>{objective.track}</td>
                  <td>{objective.title}</td>
                  <td>{objective.progress_current}/{objective.progress_complete} {objective.claimed && <Icon icon="checkmark"/>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Fragment>
      ))}
    </>
  );
};

interface AccountWizardsVaultData {
  account: { id: string, last_modified: string, name: string },
  lastModifedToday: boolean,
  lastModifiedThisWeek: boolean,
  daily: WizardsProgress | undefined,
  weekly: WizardsProgress | undefined,
  special: WizardsProgress | undefined,
  acclaim: number,
}

interface WizardsProgress {
  meta_progress_current: number,
  meta_progress_complete: number,
  meta_reward_item_id: number,
  meta_reward_astral: number,
  meta_reward_claimed: number,
  objectives: {
    id: number,
    title: string,
    track: string,
    acclaim: number,
    progress_current: number,
    progress_complete: number,
    claimed: boolean,
  }[]
}

async function loadAccountsWizardsVault(subtoken: string): Promise<AccountWizardsVaultData> {
  const account: AccountWizardsVaultData['account'] = await fetch(`https://api.guildwars2.com/v2/account?v=2019-02-21T00:00:00.000Z&access_token=${subtoken}`).then((r) => r.json());

  const lastModified = new Date(account.last_modified);
  const lastModifedToday = lastModified > lastDailyReset();
  const lastModifiedThisWeek = lastModified > lastWeeklyReset();

  const [daily, weekly, special, acclaim] = await Promise.all([
    lastModifedToday ? fetch(`https://api.guildwars2.com/v2/account/wizardsvault/daily?v=2019-02-21T00:00:00.000Z&access_token=${subtoken}`).then((r) => r.json()) as Promise<WizardsProgress> : undefined,
    lastModifiedThisWeek ? fetch(`https://api.guildwars2.com/v2/account/wizardsvault/weekly?v=2019-02-21T00:00:00.000Z&access_token=${subtoken}`).then((r) => r.json()) as Promise<WizardsProgress> : undefined,
    fetch(`https://api.guildwars2.com/v2/account/wizardsvault/special?v=2019-02-21T00:00:00.000Z&access_token=${subtoken}`).then((r) => r.json()) as Promise<WizardsProgress>,
    // TODO: needs wallet permission
    // fetch(`https://api.guildwars2.com/v2/account/wallet?v=2019-02-21T00:00:00.000Z&access_token=${subtoken}`).then((r) => r.json()).then((wallet) => wallet.find((currency: any) => currency.id === 63)?.value) as Promise<number>,
    0
  ]);

  return {
    account,
    lastModifedToday,
    lastModifiedThisWeek,
    daily, weekly, special, acclaim
  };
}

function lastDailyReset() {
  const reset = new Date();
  reset.setUTCHours(0, 0, 0, 0);
  return reset;
}

function lastWeeklyReset() {
  const reset = new Date();
  reset.setUTCDate(reset.getUTCDate() - (reset.getUTCDay() + 6) % 7);
  reset.setUTCHours(7, 30, 0, 0);
  return reset;
}
