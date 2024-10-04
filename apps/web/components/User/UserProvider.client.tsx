'use client';

import { type FC, type ReactNode } from 'react';
import { UserContext } from './context';
import type { SessionUser } from '@/lib/getUser';

interface UserProviderProps {
  children: ReactNode,
  user: Promise<SessionUser | undefined>
}

export const UserProvider: FC<UserProviderProps> = ({ children, user }) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
