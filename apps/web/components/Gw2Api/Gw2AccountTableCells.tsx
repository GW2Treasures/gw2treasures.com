'use client';

import type { Scope } from '@gw2me/client';
import type { FC, ReactNode } from 'react';
import { Gw2AccountContext } from './Gw2AccountContext';
import { useGw2Accounts } from './use-gw2-accounts';
import { Gw2AccountName } from './Gw2AccountName';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Skeleton } from '../Skeleton/Skeleton';
import { withSuspense } from '@/lib/with-suspense';
import { DataTableClientColumn, DataTableClientDynamicCell, type DataTableClientColumnProps } from '@gw2treasures/ui/components/Table/DataTable.client';

export interface Gw2AccountHeaderCellsProps extends Pick<DataTableClientColumnProps, 'align' | 'colSpan' | 'small'> {
  requiredScopes: Scope[],
  sortable?: boolean,
  noDataTable?: boolean,
}

export const Gw2AccountHeaderCells: FC<Gw2AccountHeaderCellsProps> = withSuspense(({ requiredScopes, sortable = true, noDataTable, ...props }) => {
  const accounts = useGw2Accounts(requiredScopes);

  const Column = noDataTable ? Table.HeaderCell : DataTableClientColumn;

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <Column key={account.id} sortable={sortable} id={account.id} {...props}>
      <Gw2AccountName account={account}/>
    </Column>
  ));
}, <Table.HeaderCell><Skeleton/></Table.HeaderCell>);

export interface Gw2AccountBodyCells {
  requiredScopes: Scope[],
  children: ReactNode,
  noDataTable?: boolean,
}

export const Gw2AccountBodyCells: FC<Gw2AccountBodyCells> = withSuspense(({ children, requiredScopes, noDataTable }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <Gw2AccountContext key={account.id} value={account}>
      {noDataTable ? children : (
        <DataTableClientDynamicCell id={account.id}>
          {children}
        </DataTableClientDynamicCell>
      )}
    </Gw2AccountContext>
  ));
}, <td>Loading...</td>);
