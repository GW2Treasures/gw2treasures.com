'use client';

import type { SessionUser } from '@/lib/getUser';
import type { FC, ReactNode } from 'react';
import { UserContext } from './context';

interface UserProviderProps {
  user: SessionUser | undefined;
  children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = ({ children, ...context }) => {
  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};
