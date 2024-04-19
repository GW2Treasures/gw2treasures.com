'use client';

import { ASTRAL_ACCLAIM_ID, AstralAcclaim } from '@/components/Format/AstralAcclaim';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useUser } from '@/components/User/use-user';
import { Icon, cx } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import Link from 'next/link';
import { type FC, Fragment } from 'react';
import styles from './objectives.module.css';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import { reauthorize } from '@/components/Gw2Api/reauthorize';
import { Waypoint } from '@/components/Waypoint/Waypoint';

export interface WizardVaultObjectivesProps {
  objectiveWaypoints: Record<number, number>,
}

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];
const optionalScopes = [Scope.GW2_Wallet];

const loginUrl = `/login?returnTo=${encodeURIComponent('/wizards-vault')}&scopes=${encodeURIComponent([...requiredScopes, ...optionalScopes].join(','))}`;

export const WizardVaultObjectives: FC<WizardVaultObjectivesProps> = ({ objectiveWaypoints }) => {
  const user = useUser();
  const accounts = useGw2Accounts(requiredScopes, optionalScopes);

  return (
    <>
      {!accounts.loading && accounts.error && (
        <Notice type="error">Error loading your accounts from the Guild Wars 2 API.</Notice>
      )}

      {!user.loading && !user.user ? (
        <Notice>
          <Link href={loginUrl}>Login</Link> to see your personal Wizard&apos;s Vault objectives and progress.
        </Notice>
      ) : !accounts.loading && !accounts.error && accounts.accounts.length === 0 && (
        <form action={reauthorize.bind(null, requiredScopes, undefined)}>
          <Notice>
            <FlexRow wrap>
              Authorize gw2treasures.com to see your personal Wizard&apos;s Vault objectives and progress.
              <SubmitButton type="submit" icon="gw2me-outline" appearance="tertiary">Authorize</SubmitButton>
            </FlexRow>
          </Notice>
        </form>
      )}

      <Table>
        <thead>
          <tr>
            <th>Account</th>
            <th align="right">Astral Acclaim</th>
            <th align="right">Daily</th>
            <th align="right">Weekly</th>
            <th align="right">Special</th>
          </tr>
        </thead>
        <tbody>
          {user.user && accounts.loading && (
            <tr>
              <td>Loading accounts <Icon icon="loading"/></td>
            </tr>
          )}
          {!accounts.loading && !accounts.error && accounts.accounts.map((account) => (
            <AccountOverviewRow key={account.id} account={account} objectiveWaypoints={objectiveWaypoints}/>
          ))}
          <tr className={styles.rowSection}>
            <td>Rewards</td>
            <td align="right"/>
            <td align="right"><AstralAcclaim value={20}/></td>
            <td align="right"><AstralAcclaim value={450}/></td>
            <td align="right">-</td>
          </tr>
          <tr>
            <td>Reset</td>
            <td align="right"/>
            <td align="right"><ResetTimer reset="current-daily"/></td>
            <td align="right"><ResetTimer reset="current-weekly"/></td>
            <td align="right">-</td>
          </tr>
        </tbody>
      </Table>

      {!accounts.loading && !accounts.error && accounts.accounts.map((account) => (
        <Fragment key={account.id}>
          <Headline id={account.id}>{account.name}</Headline>
          <AccountObjectiveDetails account={account} objectiveWaypoints={objectiveWaypoints}/>
        </Fragment>
      ))}
    </>
  );
};

interface AccountObjectivesProps {
  account: Gw2Account,
  objectiveWaypoints: Record<number, number>,
}

const AccountOverviewRow: FC<AccountObjectivesProps> = ({ account }) => {
  const wizardsVault = useSubscription('wizards-vault', account.id);
  const wallet = useSubscription('wallet', account.id);

  if(wizardsVault.loading || wizardsVault.error) {
    return (
      <tr key={account.id}>
        <td>{account.name} {wizardsVault.loading && <Icon icon="loading"/>}</td>
        <td colSpan={4} align="right">{!wizardsVault.loading && wizardsVault.error && <span style={{ color: 'red' }}>Error loading Wizard&apos;s Vault progress from Guild Wars 2 API</span>}</td>
      </tr>
    );
  }

  return (
    <tr key={account.id}>
      <td>{account.name}</td>
      <td align="right">{wallet.loading ? <Skeleton/> : wallet.error ? '?' : <AstralAcclaim value={wallet.data.find(({ id }) => id === ASTRAL_ACCLAIM_ID)?.value ?? 0}/>}</td>
      <td align="right">{wizardsVault.data.daily ? <>{wizardsVault.data.daily.meta_reward_claimed && <Tip tip="Reward claimed"><Icon icon="checkmark"/></Tip>} {wizardsVault.data.daily.meta_progress_current} / {wizardsVault.data.daily.meta_progress_complete}</> : <Tip tip="Account has not logged in since last reset."><span>0 / ?</span></Tip> }</td>
      <td align="right">{wizardsVault.data.weekly ? <>{wizardsVault.data.weekly.meta_reward_claimed && <Tip tip="Reward claimed"><Icon icon="checkmark"/></Tip>} {wizardsVault.data.weekly.meta_progress_current} / {wizardsVault.data.weekly.meta_progress_complete}</> : <Tip tip="Account has not logged in since last reset."><span>0 / ?</span></Tip> }</td>
      <td align="right">{wizardsVault.data.special ? <>{wizardsVault.data.special.objectives.filter(({ claimed }) => claimed).length} / {wizardsVault.data.special.objectives.length}</> : <Tip tip="Account has not logged in since last reset."><span>0 / ?</span></Tip>}</td>
    </tr>
  );
};

const AccountObjectiveDetails: FC<AccountObjectivesProps> = ({ account, objectiveWaypoints }) => {
  const wizardsVault = useSubscription('wizards-vault', account.id);

  if(wizardsVault.loading) {
    return <Skeleton/>;
  }

  if(wizardsVault.error) {
    return <Notice type="error">Error loading data</Notice>;
  }

  return (
    <>
      {!wizardsVault.data.lastModifiedToday && <Notice>This account has not logged in to the game since the last reset. Not all objectives can be shown and special objectives may be outdated.</Notice>}

      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Track</th>
            <th>Objective</th>
            <Table.HeaderCell small/>
            <Table.HeaderCell small/>
            <th>Progress</th>
            <th align="right">Astral Acclaim</th>
          </tr>
        </thead>
        <tbody>
          {wizardsVault.data.daily?.objectives.map((objective) => (
            <tr key={objective.id} className={cx(objective.claimed && styles.claimed)}>
              <td>Daily</td>
              <td>{objective.track}</td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip="Reward claimed"><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
          {wizardsVault.data.weekly?.objectives.map((objective, i) => (
            <tr key={objective.id} className={cx(i === 0 && styles.rowSection, objective.claimed && styles.claimed)}>
              <td>Weekly</td>
              <td>{objective.track}</td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip="Reward claimed"><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
          {wizardsVault.data.special?.objectives.map((objective, i) => (
            <tr key={objective.id} className={cx(i === 0 && styles.rowSection, objective.claimed && styles.claimed)}>
              <td>Special</td>
              <td>{objective.track}</td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip="Reward claimed"><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

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
