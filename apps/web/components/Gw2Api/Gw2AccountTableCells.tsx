'use client';

import type { Scope } from '@gw2me/client';
import { cloneElement, type FC, type ReactElement } from 'react';
import { useGw2Accounts } from './use-gw2-accounts';
import { Gw2AccountName } from './Gw2AccountName';
import { Table } from '@gw2treasures/ui/components/Table/Table';

export interface Gw2AccountHeaderCellsProps {
  requiredScopes: Scope[],
  small?: boolean;
}

export const Gw2AccountHeaderCells: FC<Gw2AccountHeaderCellsProps> = ({ requiredScopes, small }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <Table.HeaderCell key={account.id} small={small}>
      <Gw2AccountName account={account}/>
    </Table.HeaderCell>
  ));
};

export interface Gw2AccountBodyCells {
  requiredScopes: Scope[],
  children: ReactElement<{ accountId: string }>
}

export const Gw2AccountBodyCells: FC<Gw2AccountBodyCells> = ({ children, requiredScopes }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    cloneElement(children, { accountId: account.id, key: account.id })
  ));
};
