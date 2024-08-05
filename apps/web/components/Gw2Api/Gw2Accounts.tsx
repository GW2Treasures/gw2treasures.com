import type { FC, ReactElement, ReactNode } from 'react';
import type { Gw2Account } from './types';
import type { Scope } from '@gw2me/client';
import { useGw2Accounts } from './use-gw2-accounts';
import type { GetAccountsOptions } from './Gw2ApiContext';
import { Skeleton } from '../Skeleton/Skeleton';
import { Gw2AccountAuthorizationNotice } from './Gw2AccountAuthorizationNotice';
import { useUser } from '../User/use-user';
import { Gw2AccountLoginNotice } from './Gw2AccountLoginNotice';

export interface Gw2AccountsProps {
  children: (accounts: Gw2Account[], scopes: Scope[]) => ReactElement;
  requiredScopes: Scope[];
  optionalScopes?: Scope[];
  options?: GetAccountsOptions;
  loading?: ReactNode;
  authorizationMessage?: ReactNode;
}

export const Gw2Accounts: FC<Gw2AccountsProps> = ({ children, requiredScopes, optionalScopes = [], options, loading, authorizationMessage }) => {
  const user = useUser();
  const accounts = useGw2Accounts(requiredScopes, optionalScopes, options);

  if(user.loading || accounts.loading) {
    return loading !== undefined ? loading : (<Skeleton/>);
  }

  if(!user.user) {
    return (
      <Gw2AccountLoginNotice requiredScopes={requiredScopes} optionalScopes={optionalScopes}>
        {authorizationMessage}
      </Gw2AccountLoginNotice>
    );
  }

  if(accounts.error) {
    return (
      <span style={{ color: 'var(--color-error)' }}>Error loading your accounts from the Guild Wars 2 API.</span>
    );
  }

  if(requiredScopes.some((scope) => !accounts.scopes.includes(scope))) {
    return (
      <Gw2AccountAuthorizationNotice scopes={accounts.scopes} requiredScopes={requiredScopes} optionalScopes={optionalScopes}>
        {authorizationMessage}
      </Gw2AccountAuthorizationNotice>
    );
  }

  return children(accounts.accounts, accounts.scopes);
};
