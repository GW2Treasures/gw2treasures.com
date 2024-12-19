'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { type FC, Suspense, useCallback, useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { useInventoryItemTotal } from '@/components/Inventory/use-inventory';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { SearchItemDialog, type SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import { ItemLink } from '@/components/Item/ItemLink';
import { SearchCurrencyDialog, type SearchCurrencyDialogSubmitHandler } from '@/components/Currency/SearchCurrencyDialog';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { encodeColumns, type Column } from './helper';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { State, EmptyState } from './state';
import { TableWrapper } from '@gw2treasures/ui/components/Table/TableWrapper';

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Characters, Scope.GW2_Inventories, Scope.GW2_Unlocks, Scope.GW2_Tradingpost, Scope.GW2_Wallet];

export interface DashboardProps {
  initialColumns?: Column[]
}

export const Dashboard: FC<DashboardProps> = ({ initialColumns = [] }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  useEffect(() => {
    window.history.replaceState(null, '', '?columns=' + encodeColumns(columns));
  }, [columns]);

  return (
    <div>
      <div className={styles.intro}>
        <Notice icon="eye">Preview: The dashboard is still a work in progress!</Notice>
        <Headline id="inventory" actions={[
          (<Button key="c" onClick={() => setColumns([])} icon="delete">Clear Columns</Button>),
          (<AddColumnButton key="+" onAddColumn={(column) => setColumns([...columns, column])}/>),
        ]}
        >
          Dashboard
        </Headline>
      </div>
      <TableWrapper className={styles.overflow}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th align="left">Account</th>
              {columns.map((column) => (
                <th key={`${column.type}-${column.id}`} align="right">
                  {(column.type === 'item' && column.item) ? (
                    <ItemLink item={column.item}/>
                  ) : (column.type === 'currency' && column.currency) ? (
                    <CurrencyLink currency={column.currency}/>
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
    </div>
  );
};

const AddColumnButton: FC<{ onAddColumn: (column: Column) => void }> = ({ onAddColumn }) => {
  const [searchItem, setSearchItem] = useState(false);
  const [searchCurrency, setSearchCurrency] = useState(false);

  const handleAddItem: SearchItemDialogSubmitHandler = useCallback((item) => {
    setSearchItem(false);
    if(item) {
      onAddColumn({ type: 'item', id: item.id, item });
    }
  }, [onAddColumn]);

  const handleAddCurrency: SearchCurrencyDialogSubmitHandler = useCallback((currency) => {
    setSearchCurrency(false);
    if(currency) {
      onAddColumn({ type: 'currency', id: currency.id, currency });
    }
  }, [onAddColumn]);

  return (
    <>
      <DropDown button={<Button icon="add">Add column</Button>}>
        <MenuList>
          <Button appearance="menu" icon="item" onClick={() => setSearchItem(true)}>Add item</Button>
          <Button appearance="menu" icon="coins" onClick={() => setSearchCurrency(true)}>Add currency</Button>
        </MenuList>
      </DropDown>
      <SearchItemDialog open={searchItem} onSubmit={handleAddItem}/>
      <SearchCurrencyDialog open={searchCurrency} onSubmit={handleAddCurrency}/>
    </>
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
      ) : (
        <AccountCurrencyCell key={`${column.type}-${column.id}`} account={account} id={column.id}/>
      ))}
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
