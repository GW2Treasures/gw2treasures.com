'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { type FC, Suspense, useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { useInventoryItemTotal } from '@/components/Inventory/use-inventory';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { ItemLink } from '@/components/Item/ItemLink';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { encodeColumns, type Column } from './helper';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { State, EmptyState } from './state';
import { TableWrapper } from '@gw2treasures/ui/components/Table/TableWrapper';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { AccountAchievementProgressCell } from '@/components/Achievement/AccountAchievementProgress';
import { EditDialog } from './edit';
import { Dialog } from '@gw2treasures/ui/components/Dialog/Dialog';
import { cx } from '@gw2treasures/ui';

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Characters, Scope.GW2_Inventories, Scope.GW2_Unlocks, Scope.GW2_Tradingpost, Scope.GW2_Wallet, Scope.GW2_Progression];

export interface DashboardProps {
  initialColumns?: Column[],
  embedded?: boolean,
}

export const Dashboard: FC<DashboardProps> = ({ initialColumns = [], embedded = false }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if(!embedded) {
      window.history.replaceState(null, '', '?columns=' + encodeColumns(columns));
    }
  }, [columns, embedded]);

  return (
    <div className={cx(embedded && styles.embedded)}>
      {!embedded && (
        <div className={styles.intro}>
          <Notice icon="eye">Preview: The dashboard is still a work in progress!</Notice>
          <Headline id="inventory" actions={<Button icon="edit" onClick={() => setIsEditing(true)}>Edit dashboard</Button>}>
            Dashboard
          </Headline>
        </div>
      )}
      <TableWrapper className={styles.overflow}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th align="left">Account</th>
              {columns.map((column) => (
                <th key={`${column.type}-${column.id}`} align={column.type !== 'achievement' ? 'right' : 'left'}>
                  {(column.type === 'item' && column.item) ? (
                    <ItemLink item={column.item}/>
                  ) : (column.type === 'currency' && column.currency) ? (
                    <CurrencyLink currency={column.currency}/>
                  ) : (column.type === 'achievement' && column.achievement) ? (
                    <AchievementLink achievement={column.achievement}/>
                  ) : (
                    <>[{column.type}: {column.id}]</>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <Gw2Accounts requiredScopes={requiredScopes} loading={null} authorizationMessage={null} loginMessage={null}>
            {(accounts) => (
              <tbody>
                {accounts.map((account) => <AccountRow key={account.id} account={account} columns={columns}/>)}
              </tbody>
            )}
          </Gw2Accounts>
        </table>
      </TableWrapper>
      <Suspense fallback={<EmptyState icon="loading">Loading...</EmptyState>}>
        <State requiredScopes={requiredScopes}/>
      </Suspense>
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} title="Edit Dashboard">
        <EditDialog columns={columns} onEdit={(columns) => { setColumns(columns); setIsEditing(false); }}/>
      </Dialog>
    </div>
  );
};

interface AccountRow {
  account: Gw2Account,
  columns: Column[],
}

const AccountRow: FC<AccountRow> = ({ account, columns }) => {
  return (
    <tr>
      <td><Gw2AccountName account={account}/></td>
      {columns.map((column) => column.type === 'item' ? (
        <AccountItemCell key={`${column.type}-${column.id}`} account={account} id={column.id}/>
      ) : column.type === 'currency' ? (
        <AccountCurrencyCell key={`${column.type}-${column.id}`} account={account} id={column.id}/>
      ) : column.type === 'achievement' ? (
        <AccountAchievementProgressCell type="objective" key={`${column.type}-${column.id}`} accountId={account.id} achievement={column.achievement!}/>
      ) : <td/>)}
    </tr>
  );
};

interface AccountCellProps {
  account: Gw2Account,
  id: number,
}

const AccountItemCell: FC<AccountCellProps> = ({ account, id }) => {
  const total = useInventoryItemTotal(account.id, id);

  return (
    <td align="right">{total.loading ? <Skeleton/> : total.error ? 'error' : <FormatNumber value={total.count}/>}</td>
  );
};

const AccountCurrencyCell: FC<AccountCellProps> = ({ account, id }) => {
  const wallet = useSubscription('wallet', account.id);
  const currency = !wallet.loading && !wallet.error
    ? wallet.data.find((currency) => currency.id === id)
    : undefined;

  return (
    <td align="right">
      {wallet.loading ? (
        <Skeleton/>
      ) : wallet.error ? (
        <span style={{ color: 'var(--color-error)' }}>Error loading wallet.</span>
      ) : (
        <CurrencyValue currencyId={id} value={currency?.value ?? 0}/>
      )}
    </td>
  );
};
