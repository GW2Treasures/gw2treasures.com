'use client';

import { type FC, type ReactNode, useCallback, useMemo, useRef, useState, type MouseEventHandler } from 'react';
import { Gw2ApiContext, type GetAccountsOptions } from './Gw2ApiContext';
import { fetchAccounts } from './fetch-accounts-action';
import { ErrorCode, type Gw2Account } from './types';
import styles from './Gw2ApiProvider.module.css';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { reauthorize } from './reauthorize';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useUser } from '../User/use-user';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import type { Scope } from '@gw2me/client';
import { useRouter } from 'next/navigation';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

export interface Gw2ApiProviderProps {
  children: ReactNode;
}

const initialGrantedScopes: Scope[] = [];

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children }) => {
  const accounts = useRef<[Scope[], Promise<Gw2Account[]>]>(undefined);
  const [error, setError] = useState<ErrorCode>();
  const [grantedScopes, setGrantedScopes] = useState<Scope[]>(initialGrantedScopes);
  const [missingScopes, setMissingScopes] = useState<Scope[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const { user, loading: loadingUser } = useUser();
  const router = useRouter();
  const [hiddenAccounts, setHiddenAccounts] = useLocalStorageState<string[]>('accounts.hidden', []);

  // eslint-disable-next-line require-await
  const getAccounts = useCallback(async (requiredScopes: Scope[], optionalScopes: Scope[] = [], { includeHidden = false }: GetAccountsOptions = {}) => {
    // if the current user is not yet loaded or we SSR
    if(loadingUser || typeof window === 'undefined') {
      return [];
    }

    // if the user is not logged in and hasn't dismissed the toast yet show error
    if(!user) {
      if(!dismissed) {
        setError(ErrorCode.NOT_LOGGED_IN);
        setMissingScopes([...requiredScopes, ...optionalScopes]);
      }

      // no accounts :(
      return [];
    }

    // get previous (pending) request
    const [requestedScopes, pendingPromise] = accounts.current ?? [[] as Scope[], undefined];

    const filterHiddenAccounts = (accounts: Gw2Account[]) => accounts
      .map((account) => ({ ...account, hidden: hiddenAccounts.includes(account.id) }))
      .filter((account) => !account.hidden || includeHidden);

    // if there was no previous request yet or we need more permissions
    if(!pendingPromise || !requiredScopes.every((required) => requestedScopes.includes(required))) {
      // always add to the scope, so we request the max amount of scopes the user has encountered
      const combinedScopes = [...requestedScopes, ...requiredScopes];

      // fetch accounts
      // TODO: we might be able to even skip the request if we know we are missing scopes...
      const promise = fetchAccounts(combinedScopes).then((response) => {
        if(response.error !== undefined) {
          setError(response.error);
          setGrantedScopes([]);
          setMissingScopes([...combinedScopes, ...optionalScopes]);
          return [];
        }

        setGrantedScopes(response.scopes);

        const missingOptionalScopes = optionalScopes.filter((scope) => !response.scopes.includes(scope));
        if(missingOptionalScopes.length > 0) {
          setMissingScopes(missingOptionalScopes);
        }

        return response.accounts;
      });

      // store request so subsequent calls return the same promise
      accounts.current = [combinedScopes, promise];

      return promise.then(filterHiddenAccounts);
    }

    const missingOptionalScopes = optionalScopes.filter((scope) => !requestedScopes.includes(scope));
    if(missingOptionalScopes.length > 0) {
      setMissingScopes((missingScopes) => Array.from(new Set([...missingScopes, ...missingOptionalScopes])));
    }

    return pendingPromise.then(filterHiddenAccounts);
  }, [dismissed, hiddenAccounts, loadingUser, user]);

  const handleDismiss = useCallback(() => {
    setError(undefined);
    setDismissed(true);
  }, []);

  const handleLogin: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();

    // hide dialog
    setError(undefined);

    // navigate to login page with the current url as returnTo param
    router.push(`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}&scopes=${encodeURIComponent(missingScopes.join(','))}`);
  }, [missingScopes, router]);

  // const scopes = useStablePrimitiveArray(grantedScopes);
  const scopes = grantedScopes;

  const setHidden = useCallback((id: string, hidden: boolean) => {
    setHiddenAccounts((hiddenAccounts) => hidden ? [...hiddenAccounts, id] : hiddenAccounts.filter((accountId) => accountId !== id));
  }, [setHiddenAccounts]);

  // make sure the context value only changes if getAccounts or error changes
  const value = useMemo(() => ({ getAccounts, setHidden, error, scopes }), [getAccounts, setHidden, scopes, error]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.NOT_LOGGED_IN) && (
        <div className={styles.dialog}>
          Login to gw2treasures.com to access your Guild Wars 2 accounts.
          <div>
            <FlexRow>
              <Button onClick={handleDismiss}>Later</Button>
              <LinkButton onClick={handleLogin} icon="user" href="/login">Login</LinkButton>
            </FlexRow>
          </div>
        </div>
      )}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION || (missingScopes.some((scope) => !grantedScopes.includes(scope)) && !dismissed && grantedScopes !== initialGrantedScopes)) && (
        <form className={styles.dialog} action={reauthorize.bind(null, missingScopes, undefined)}>
          Authorize gw2treasures.com to access your Guild Wars 2 accounts.
          <div>
            <FlexRow>
              <Button onClick={handleDismiss}>Later</Button>
              <SubmitButton type="submit" icon="gw2me-outline">Authorize</SubmitButton>
            </FlexRow>
          </div>
        </form>
      )}
    </Gw2ApiContext.Provider>
  );
};
