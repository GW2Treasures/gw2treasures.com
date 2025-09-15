import { type FC, type ReactNode } from 'react';
import { UserProvider as UserProviderClient } from './UserProvider.client';
import { getUser } from '@/lib/getUser';

interface UserProviderProps {
  children: ReactNode,
}

/** Load user (async suspended) and provide it to a global context to be consumed with `useUser()` */
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  return (
    <UserProviderClient user={getUser()}>
      {children}
    </UserProviderClient>
  );
};
