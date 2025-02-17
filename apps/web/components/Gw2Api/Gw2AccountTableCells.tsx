'use client';

import type { Scope } from '@gw2me/client';
import { cloneElement, use, type FC, type ReactElement } from 'react';
import { useGw2Accounts } from './use-gw2-accounts';
import { Gw2AccountName } from './Gw2AccountName';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Skeleton } from '../Skeleton/Skeleton';
import { withSuspense } from '@/lib/with-suspense';
import { DataTableClientColumn, DataTableClientDynamicCell } from '@gw2treasures/ui/components/Table/DataTable.client';

export interface Gw2AccountHeaderCellsProps {
  requiredScopes: Scope[],
  small?: boolean;
  colSpan?: number;
  sortable?: boolean;
}

export const Gw2AccountHeaderCells: FC<Gw2AccountHeaderCellsProps> = withSuspense(({ requiredScopes, small, colSpan, sortable = true }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <DataTableClientColumn key={account.id} small={small} sortable={sortable} id={account.id} colSpan={colSpan}>
      <Gw2AccountName account={account}/>
    </DataTableClientColumn>
  ));
}, <Table.HeaderCell><Skeleton/></Table.HeaderCell>);

export interface Gw2AccountBodyCells {
  requiredScopes: Scope[],
  children: ReactElement<{ accountId: string }>
}

export const Gw2AccountBodyCells: FC<Gw2AccountBodyCells> = withSuspense(({ children, requiredScopes }) => {
  const accounts = useGw2Accounts(requiredScopes);

  // @ts-expect-error this is a workaround, because react@19 somehow broke passing children elements
  //   (Gw2AccountBodyCells is a client component, children are sometimes server components).
  //   Before react@19 `children` was `<Lazy/>`, now it is `{ $$typeof: Symbol(react.lazy) }`.
  //   This seems to work for now, but I need to create a reproduction for this and report it to get it fixed.
  if(children.$$typeof === Symbol.for('react.lazy')) { children = use(children._payload); }

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <DataTableClientDynamicCell id={account.id} key={account.id}>
      {cloneElement(children, { accountId: account.id })}
    </DataTableClientDynamicCell>
  ));
}, <td>Loading...</td>);
