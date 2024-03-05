'use client';

import { type FC, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import { fetchAccounts } from './fetch-accounts-action';
import { ErrorCode, type Gw2Account } from './types';
import styles from './Gw2ApiProvider.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { reauthorize } from './reauthorize';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { useUser } from '../User/use-user';
import { SubmitButton } from '@gw2treasures/ui/components/Form/Buttons/SubmitButton';
import type { Scope } from '@gw2me/client';

export interface Gw2ApiProviderProps {
  children: ReactNode;
}

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children }) => {
  const accounts = useRef<[requestedScopes: Scope[], Promise<Gw2Account[]>]>();
  const [error, setError] = useState<ErrorCode>();
  const [grantedScopes, setGrantedScopes] = useState<Scope[]>([]);
  const [missingScopes, setMissingScopes] = useState<Scope[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const { user, loading: loadingUser } = useUser();

  // eslint-disable-next-line require-await
  const getAccounts = useCallback(async (requiredScopes: Scope[]) => {
    // if the current user is not yet loaded or we SSR
    if(loadingUser || typeof window === 'undefined') {
      return [];
    }

    // if the user is not logged in and hasn't dismissed the toast yet show error
    if(!user) {
      if(!dismissed) {
        setError(ErrorCode.NOT_LOGGED_IN);
      }

      // no accounts :(
      return [];
    }

    // get previous (pending) request
    const [requestedScopes, pendingPromise] = accounts.current ?? [[], undefined];

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
          setMissingScopes(combinedScopes);
          return [];
        }

        setGrantedScopes(response.scopes);

        return response.accounts;
      });

      // store request so subsequent calls return the same promise
      accounts.current = [combinedScopes, promise];

      return promise;
    }

    return pendingPromise;
  }, [dismissed, loadingUser, user]);

  const handleDismiss = useCallback(() => {
    setError(undefined);
    setDismissed(true);
  }, []);

  // const scopes = useStablePrimitiveArray(grantedScopes);
  const scopes = grantedScopes;

  // make sure the context value only changes if getAccounts or error changes
  const value = useMemo(() => ({ getAccounts, error, scopes }), [getAccounts, scopes, error]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION || error === ErrorCode.NOT_LOGGED_IN) && (
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
