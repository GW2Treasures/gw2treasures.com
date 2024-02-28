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

export interface Gw2ApiProviderProps {
  children: ReactNode;
}

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children }) => {
  const accounts = useRef<Promise<Gw2Account[]>>();
  const [error, setError] = useState<ErrorCode>();
  const [dismissed, setDismissed] = useState(false);
  const { user, loading: loadingUser } = useUser();

  // eslint-disable-next-line require-await
  const getAccounts = useCallback(async () => {
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
      console.log('fetch accounts');

      accounts.current = fetchAccounts().then((response) => {
        if(response.error !== undefined) {
          setError(response.error);
          return [];
        }

        return response.accounts;
      });
    }

    return accounts.current;
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
        <form className={styles.dialog} action={reauthorize}>
          Authorize gw2treasures.com to view your progress.
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
