'use client';

import type { Scope } from '@gw2me/client';
import { cloneElement, use, type FC, type ReactElement, Fragment } from 'react';
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
  children: ReactElement<{ accountId: string }>,
  noDataTable?: boolean,
}

export const Gw2AccountBodyCells: FC<Gw2AccountBodyCells> = withSuspense(({ children, requiredScopes, noDataTable }) => {
  const accounts = useGw2Accounts(requiredScopes);

  // @ts-expect-error this is a workaround, because react@19 somehow broke passing children elements
  //   (Gw2AccountBodyCells is a client component, children are sometimes server components).
  //   Before react@19 `children` was `<Lazy/>`, now it is `{ $$typeof: Symbol(react.lazy) }`.
  //   This seems to work for now, but I need to create a reproduction for this and report it to get it fixed.
  if(children.$$typeof === Symbol.for('react.lazy')) { children = use(children._payload); }

  const Cell = noDataTable ? Fragment : DataTableClientDynamicCell;

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <Cell id={account.id} key={account.id}>
      {cloneElement(children, { accountId: account.id })}
    </Cell>
  ));
}, <td>Loading...</td>);
