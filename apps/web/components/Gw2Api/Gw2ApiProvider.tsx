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
  const [missingScopes, setMissingScopes] = useState<Scope[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const { user, loading: loadingUser } = useUser();

  // eslint-disable-next-line require-await
  const getAccounts = useCallback(async (requiredScopes: Scope[]) => {
    if(loadingUser || typeof window === 'undefined') {
      return [];
    }

    if(!user) {
      if(!dismissed) {
        setError(ErrorCode.NOT_LOGGED_IN);
      }

      return [];
    }

    if(accounts.current === undefined) {
      accounts.current = [requiredScopes, fetchAccounts(requiredScopes).then((response) => {
        if(response.error !== undefined) {
          setError(response.error);
          setMissingScopes(requestedScopes);
          return [];
        }

        return response.accounts;
      })];
    }

    const [requestedScopes, pendingPromise] = accounts.current;

    // if we require more scopes than already requested...
    if(!requiredScopes.every((required) => requestedScopes.includes(required))) {
      const combinedScopes = Array.from(new Set([...requestedScopes, ...requiredScopes]));

      accounts.current = [combinedScopes, fetchAccounts(combinedScopes).then((response) => {
        if(response.error !== undefined) {
          setError(response.error);
          setMissingScopes(combinedScopes);
          return [];
        }

        return response.accounts;
      })];
    }

    return pendingPromise;
  }, [dismissed, loadingUser, user]);

  const handleDismiss = useCallback(() => {
    setError(undefined);
    setDismissed(true);
  }, []);

  const value = useMemo(() => ({ getAccounts, error }), [getAccounts, error]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION || error === ErrorCode.NOT_LOGGED_IN) && (
        <form className={styles.dialog} action={reauthorize.bind(null, missingScopes, undefined)}>
          Authorize gw2treasures.com to access your Guild Wars 2 accounts. ({missingScopes})
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
