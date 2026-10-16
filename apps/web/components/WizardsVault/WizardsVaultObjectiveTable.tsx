'use client';

import type { FC } from 'react';
import { Scope } from '@gw2me/client';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Icon } from '@gw2treasures/ui';
import { Gw2AccountName } from '../Gw2Api/Gw2AccountName';
import { useWizardsVault } from './use-wizards-vault';
import { Skeleton } from '../Skeleton/Skeleton';
import { ProgressCell } from '../Achievement/ProgressCell';
import { Gw2Accounts } from '../Gw2Api/Gw2Accounts';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { Gw2ApiErrorBadge } from '../Gw2Api/api-error-badge';
import { Gw2AccountContext } from '../Gw2Api/Gw2AccountContext';
import { useGw2Account } from '../Gw2Api/use-gw2-account';

interface WizardsVaultObjectiveTableProps {
  objectiveId: number,
  disabledLoginNotification?: boolean,
}

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];

export const WizardsVaultObjectiveTable: FC<WizardsVaultObjectiveTableProps> = ({ objectiveId, disabledLoginNotification }) => {
  return (
    <Gw2Accounts
      requiredScopes={requiredScopes}
      loading={<SkeletonTable columns={['Account', 'Progress']} rows={1}/>}
      authorizationMessage={disabledLoginNotification ? null : 'gw2treasures.com needs additional permissions to display your Wizard\'s Vault progress.'}
      loginMessage={disabledLoginNotification ? null : 'Login to show your Wizard\'s Vault progress.'}
    >
      {(accounts) => (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Account</Table.HeaderCell>
              <Table.HeaderCell>Progress</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <Gw2AccountContext key={account.id} value={account}>
                <tr>
                  <td><Gw2AccountName account={account}/></td>
                  <WizardsVaultObjectiveTableProgressCell objectiveId={objectiveId}/>
                </tr>
              </Gw2AccountContext>
            ))}
          </tbody>
        </Table>
      )}
    </Gw2Accounts>
  );
};

interface WizardsVaultObjectiveTableProgressCellProps {
  objectiveId: number,
}

export const WizardsVaultObjectiveTableProgressCell: FC<WizardsVaultObjectiveTableProgressCellProps> = ({ objectiveId }) => {
  const { id: accountId } = useGw2Account();
  const wizardsVault = useWizardsVault(accountId);

  if(wizardsVault.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(wizardsVault.error) {
    return (
      <td><Gw2ApiErrorBadge/></td>
    );
  }

  const progress = wizardsVault.special?.objectives.find(({ id }) => id === objectiveId)
    ?? wizardsVault.weekly?.objectives.find(({ id }) => id === objectiveId)
    ?? wizardsVault.daily?.objectives.find(({ id }) => id === objectiveId);

  if(!progress) {
    return (
      <td>?</td>
    );
  }

  return (
    <ProgressCell progress={progress.progress_current / progress.progress_complete}>
      {progress.claimed ? <Icon icon="checkmark"/> : <>{progress.progress_current} / {progress.progress_complete}</>}
    </ProgressCell>
  );
};
