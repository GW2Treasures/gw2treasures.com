'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import { SessionUser } from '@/lib/getUser';
import { fetchAccounts } from './fetch-accounts-action';
import { ErrorCode } from './types';
import styles from './Gw2ApiProvider.module.css';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { reauthorize } from './reauthorize';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

export interface Gw2ApiProviderProps {
  children: ReactNode;
  user: SessionUser | undefined;
}

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children, user }) => {
  const [value, setValue] = useState<Gw2ApiContext>({ accounts: [] });
  const [error, setError] = useState<ErrorCode>();

  useEffect(() => {
    if(!user) {
      return;
    }

    fetchAccounts().then((response) => {
      if(response.error !== undefined) {
        setError(response.error);
        return;
      }

      setValue({ accounts: response.accounts });
    });
  }, [user]);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION) && (
        <form className={styles.dialog} action={reauthorize}>
          Authorize gw2treasures.com to view your progress.
          <FlexRow>
            <Button onClick={() => setError(undefined)}>Later</Button>
            <Button type="submit" icon="gw2me-outline">Authorize</Button>
          </FlexRow>
        </form>
      )}
    </Gw2ApiContext.Provider>
  );
};
