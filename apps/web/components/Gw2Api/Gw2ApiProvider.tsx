'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import { SessionUser } from '@/lib/getUser';
import { fetchAccounts } from './fetch-accounts-action';

export interface Gw2ApiProviderProps {
  children: ReactNode;
  user: SessionUser | undefined;
}

export const Gw2ApiProvider: FC<Gw2ApiProviderProps> = ({ children, user }) => {
  const [value, setValue] = useState<Gw2ApiContext>({ accounts: [] });

  useEffect(() => {
    console.log('useEffect');

    if(!user) {
      console.log('user not set');
      return;
    }

    fetchAccounts().then((accounts) => {
      if(!accounts) {
        return;
      }

      setValue({ accounts });
    });
  }, [user]);

  console.log(value);

  return (
    <Gw2ApiContext.Provider value={value}>
      {children}
    </Gw2ApiContext.Provider>
  );
};
