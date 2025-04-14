'use client';

import { experimental_useEffectEvent as useEffectEvent, type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gw2ApiContext, type GetAccountsOptions } from './Gw2ApiContext';
import { fetchAccounts } from './fetch-accounts-action';
import { ErrorCode, type Gw2Account } from './types';
import styles from './Gw2ApiProvider.module.css';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { reauthorize } from './reauthorize';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useUserPromise } from '../User/use-user';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import type { Scope } from '@gw2me/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { useFedCM } from '../gw2me/fedcm-context';

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
  const userPromise = useUserPromise();
  const [hiddenAccounts, setHiddenAccounts] = useLocalStorageState<string[]>('accounts.hidden', []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = pathname + (searchParams.size > 0 ? '?' + searchParams : '');
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}&scopes=${encodeURIComponent(missingScopes.join(','))}`;

  const getAccounts = useCallback(async (requiredScopes: Scope[], optionalScopes: Scope[] = [], { includeHidden = false }: GetAccountsOptions = {}) => {
    // always return [] during SSR
    if(typeof window === 'undefined') {
      return [];
    }

    // wait for user to be loaded
    const user = await userPromise;

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
  }, [dismissed, hiddenAccounts, userPromise]);

  const handleDismiss = useCallback(() => {
    setError(undefined);
    setDismissed(true);
  }, []);

  // const scopes = useStablePrimitiveArray(grantedScopes);
  const scopes = grantedScopes;

  const setHidden = useCallback((id: string, hidden: boolean) => {
    setHiddenAccounts((hiddenAccounts) => hidden ? [...hiddenAccounts, id] : hiddenAccounts.filter((accountId) => accountId !== id));
  }, [setHiddenAccounts]);

  const triggerFedCM = useFedCM();
  // attempt silent logins
  const triggerSilentFedCM = useEffectEvent(() => {
    triggerFedCM({
      returnTo,
      scopes: missingScopes,
      mediation: 'silent',
      mode: 'passive',
    });
  });

  useEffect(() => {
    if(error === ErrorCode.NOT_LOGGED_IN) {
      triggerSilentFedCM();
    }
  // react-hooks/exhaustive-deps doesn't correctly handle useEffectEvent yet
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);


  // make sure the context value only changes if getAccounts or error changes
  const value = useMemo(() => ({ getAccounts, setHidden, error, scopes }), [getAccounts, setHidden, scopes, error]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.NOT_LOGGED_IN) && pathname !== '/login' && (
        <div className={styles.dialog}>
          <p>Login to gw2treasures.com to access your Guild Wars 2 accounts.</p>
          <div>
            <FlexRow>
              <Button onClick={handleDismiss}>Later</Button>
              <LinkButton icon="user" href={loginUrl}>Login</LinkButton>
            </FlexRow>
          </div>
        </div>
      )}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION || (missingScopes.some((scope) => !grantedScopes.includes(scope)) && !dismissed && grantedScopes !== initialGrantedScopes)) && (
        <form className={styles.dialog} action={reauthorize.bind(null, missingScopes, undefined)}>
          <p>Authorize gw2treasures.com to access your Guild Wars 2 accounts.</p>
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
