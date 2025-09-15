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
import { type FC, Fragment, type ReactNode } from 'react';
import styles from './objectives.module.css';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { Waypoint } from '@/components/Waypoint/Waypoint';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2AccountAuthorizationNotice } from '@/components/Gw2Api/Gw2AccountAuthorizationNotice';
import { useWizardsVault } from '@/components/WizardsVault/use-wizards-vault';
import type { WizardsVaultObjectiveClientTranslations } from './translations';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { WizardsVaultTrackIcon } from '@/components/WizardsVault/track-icon';

export interface WizardVaultObjectivesProps {
  seasonEnd?: Date,
  objectiveWaypoints: Record<number, number>,
  dailyChest: ReactNode,
  weeklyChest: ReactNode,
  translations: WizardsVaultObjectiveClientTranslations,
}

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];
const optionalScopes = [Scope.GW2_Wallet];

const loginUrl = `/login?returnTo=${encodeURIComponent('/wizards-vault')}&scopes=${encodeURIComponent([...requiredScopes, ...optionalScopes].join(','))}`;

export const WizardVaultObjectives: FC<WizardVaultObjectivesProps> = ({ seasonEnd, objectiveWaypoints, dailyChest, weeklyChest, translations }) => {
  const user = useUser();
  const accounts = useGw2Accounts(requiredScopes, optionalScopes);

  return (
    <>
      {!accounts.loading && accounts.error && (
        <Notice type="error">Error loading your accounts from the Guild Wars 2 API.</Notice>
      )}

      {!user ? (
        <Notice>
          <Link href={loginUrl}>Login</Link> to see your personal Wizard&apos;s Vault objectives and progress.
        </Notice>
      ) : !accounts.loading && !accounts.error && (
        <Gw2AccountAuthorizationNotice scopes={accounts.scopes} requiredScopes={requiredScopes} optionalScopes={optionalScopes}>
          Authorize gw2treasures.com to see your personal Wizard&apos;s Vault objectives and progress.
        </Gw2AccountAuthorizationNotice>
      )}

      <Table>
        <thead>
          <tr>
            <th>{translations['wizards-vault.account']}</th>
            <th align="right">{translations['wizards-vault.type.daily']}</th>
            <th align="right">{translations['wizards-vault.type.weekly']}</th>
            <th align="right">{translations['wizards-vault.type.special']}</th>
            <th align="right">{translations['wizards-vault.astral-acclaim']}</th>
          </tr>
        </thead>
        <tbody>
          {user && accounts.loading && (
            <tr>
              <td>{translations['wizards-vault.account.loading']} <Icon icon="loading"/></td>
            </tr>
          )}
          {!accounts.loading && !accounts.error && accounts.accounts.map((account) => (
            <AccountOverviewRow key={account.id} account={account} objectiveWaypoints={objectiveWaypoints} translations={translations}/>
          ))}
          <tr className={styles.rowSection}>
            <td>{translations['wizards-vault.rewards']}</td>
            <td align="right">{dailyChest} + <AstralAcclaim value={20}/></td>
            <td align="right">{weeklyChest} + <AstralAcclaim value={450}/></td>
            <td align="right">-</td>
            <td align="right"/>
          </tr>
          <tr>
            <td>{translations['wizards-vault.reset']}</td>
            <td align="right"><ResetTimer reset="current-daily"/></td>
            <td align="right"><ResetTimer reset="current-weekly"/></td>
            <td align="right">{seasonEnd ? <ResetTimer reset={seasonEnd}/> : '-'}</td>
            <td align="right"/>
          </tr>
        </tbody>
      </Table>

      {!accounts.loading && !accounts.error && accounts.accounts.map((account) => (
        <Fragment key={account.id}>
          <Headline id={account.id}><Gw2AccountName account={account} long/></Headline>
          <AccountObjectiveDetails account={account} objectiveWaypoints={objectiveWaypoints} translations={translations}/>
        </Fragment>
      ))}
    </>
  );
};

interface AccountObjectivesProps {
  account: Gw2Account,
  objectiveWaypoints: Record<number, number>,
  translations: WizardsVaultObjectiveClientTranslations,
}

const AccountOverviewRow: FC<AccountObjectivesProps> = ({ account, translations }) => {
  const wizardsVault = useWizardsVault(account.id);
  const wallet = useSubscription('wallet', account.id);

  if(wizardsVault.loading || wizardsVault.error) {
    return (
      <tr key={account.id}>
        <td><Gw2AccountName account={account}/> {wizardsVault.loading && <Icon icon="loading"/>}</td>
        <td colSpan={4} align="right">{!wizardsVault.loading && wizardsVault.error && <span style={{ color: 'red' }}>Error loading Wizard&apos;s Vault progress from Guild Wars 2 API</span>}</td>
      </tr>
    );
  }

  return (
    <tr key={account.id}>
      <td><Gw2AccountName account={account}/></td>
      <td align="right">{wizardsVault.daily ? <>{wizardsVault.daily.meta_reward_claimed && <Tip tip={translations['wizards-vault.reward.claimed']}><Icon icon="checkmark"/></Tip>} {wizardsVault.daily.meta_progress_current} / {wizardsVault.daily.meta_progress_complete}</> : <Tip tip={translations['wizards-vault.account.not-logged-in.tooltip']}><span>0 / ?</span></Tip> }</td>
      <td align="right">{wizardsVault.weekly ? <>{wizardsVault.weekly.meta_reward_claimed && <Tip tip={translations['wizards-vault.reward.claimed']}><Icon icon="checkmark"/></Tip>} {wizardsVault.weekly.meta_progress_current} / {wizardsVault.weekly.meta_progress_complete}</> : <Tip tip={translations['wizards-vault.account.not-logged-in.tooltip']}><span>0 / ?</span></Tip> }</td>
      <td align="right">{wizardsVault.special ? <>{wizardsVault.special.objectives.filter(({ claimed }) => claimed).length} / {wizardsVault.special.objectives.length}</> : <Tip tip={translations['wizards-vault.account.not-logged-in.tooltip']}><span>0 / ?</span></Tip>}</td>
      <td align="right">{wallet.loading ? <Skeleton/> : wallet.error ? '?' : <AstralAcclaim value={wallet.data.find(({ id }) => id === ASTRAL_ACCLAIM_ID)?.value ?? 0}/>}</td>
    </tr>
  );
};

const AccountObjectiveDetails: FC<AccountObjectivesProps> = ({ account, objectiveWaypoints, translations }) => {
  const wizardsVault = useWizardsVault(account.id);

  if(wizardsVault.loading) {
    return <Skeleton/>;
  }

  if(wizardsVault.error) {
    return <Notice type="error">Error loading data</Notice>;
  }

  return (
    <>
      {(wizardsVault.daily === null || wizardsVault.weekly === null) && <Notice>{translations['wizards-vault.account.not-logged-in']}</Notice>}

      <Table>
        <thead>
          <tr>
            <th>{translations['wizards-vault.type']}</th>
            <th>{translations['wizards-vault.track']}</th>
            <th>{translations['wizards-vault.objective']}</th>
            <Table.HeaderCell small/>
            <Table.HeaderCell small/>
            <th>{translations['wizards-vault.progress']}</th>
            <th align="right">{translations['wizards-vault.astral-acclaim']}</th>
          </tr>
        </thead>
        <tbody>
          {wizardsVault.daily?.objectives.map((objective) => (
            <tr key={objective.id} className={cx(objective.claimed && styles.claimed)}>
              <td>{translations['wizards-vault.type.daily']}</td>
              <td><FlexRow><WizardsVaultTrackIcon track={objective.track}/>{translations[`wizards-vault.track.${objective.track}`]}</FlexRow></td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip={translations['wizards-vault.reward.claimed']}><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
          {wizardsVault.weekly?.objectives.map((objective, i) => (
            <tr key={objective.id} className={cx(i === 0 && styles.rowSection, objective.claimed && styles.claimed)}>
              <td>{translations['wizards-vault.type.weekly']}</td>
              <td><FlexRow><WizardsVaultTrackIcon track={objective.track}/>{translations[`wizards-vault.track.${objective.track}`]}</FlexRow></td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip={translations['wizards-vault.reward.claimed']}><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
          {wizardsVault.special?.objectives.map((objective, i) => (
            <tr key={objective.id} className={cx(i === 0 && styles.rowSection, objective.claimed && styles.claimed)}>
              <td>{translations['wizards-vault.type.special']}</td>
              <td><FlexRow><WizardsVaultTrackIcon track={objective.track}/>{translations[`wizards-vault.track.${objective.track}`]}</FlexRow></td>
              <td>{objective.title}</td>
              <td>{objectiveWaypoints[objective.id] && (<Waypoint id={objectiveWaypoints[objective.id]}/>)}</td>
              <td>{objective.claimed && <Tip tip={translations['wizards-vault.reward.claimed']}><Icon icon="checkmark"/></Tip>}</td>
              <ProgressCell progress={objective.progress_current / objective.progress_complete}>{objective.progress_current} / {objective.progress_complete}</ProgressCell>
              <td align="right"><AstralAcclaim value={objective.acclaim}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
