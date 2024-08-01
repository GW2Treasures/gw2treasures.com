'use client';

import type { Scope } from '@gw2me/client';
import { cloneElement, type FC, type ReactElement } from 'react';
import { useGw2Accounts } from './use-gw2-accounts';
import { Gw2AccountName } from './Gw2AccountName';

export interface Gw2AccountHeaderCellsProps {
  requiredScopes: Scope[]
}

export const Gw2AccountHeaderCells: FC<Gw2AccountHeaderCellsProps> = ({ requiredScopes }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <th key={account.id}><Gw2AccountName account={account}/></th>
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
