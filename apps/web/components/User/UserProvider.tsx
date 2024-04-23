import { Suspense, type FC, type ReactNode, use } from 'react';
import { UserProvider as UserProviderClient, UserSetter } from './UserProvider.client';
import { getUser } from '@/lib/getUser';

interface UserProviderProps {
  children: ReactNode;
};

/** Load user (async suspended) and provide it to a global context to be consumed with `useUser()` */
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  return (
    <UserProviderClient>
      <Suspense><UserLoader/></Suspense>
      {children}
    </UserProviderClient>
  );
};

const UserLoader: FC = async ({ }) => {
  const user = await getUser();

  return <UserSetter context={{ user, loading: false }}/>;
};
