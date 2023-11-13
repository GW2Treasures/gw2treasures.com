'use client';

import { type FC, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import type { SessionUser } from '@/lib/getUser';
import { fetchAccounts } from './fetch-accounts-action';
import { ErrorCode, type Gw2Account } from './types';
import styles from './Gw2ApiProvider.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { reauthorize } from './reauthorize';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

export interface Gw2ApiProviderProps {
  children: ReactNode;
  user: SessionUser | undefined;
}

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children, user }) => {
  const accounts = useRef<Promise<Gw2Account[]>>();
  const [error, setError] = useState<ErrorCode>();

  // eslint-disable-next-line require-await
  const getAccounts = useCallback(async () => {
    if(!user || typeof window === 'undefined') {
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
  }, [user]);

  const value = useMemo(() => ({ getAccounts }), [getAccounts]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION) && (
        <form className={styles.dialog} action={reauthorize}>
          Authorize gw2treasures.com to get your inventory and progress.
          <div>
            <FlexRow>
              <Button onClick={() => setError(undefined)}>Later</Button>
              <Button type="submit" icon="gw2me-outline">Authorize</Button>
            </FlexRow>
          </div>
        </form>
      )}
    </Gw2ApiContext.Provider>
  );
};
