'use client';

import { useState, type FC, type ReactNode, use, useEffect } from 'react';
import { SetUserContext, UserContext } from './context';

interface UserProviderProps {
  children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContext>({ user: undefined });

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
};

export const UserSetter: FC<{ context: UserContext }> = ({ context }) => {
  const setContext = use(SetUserContext);

  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  return null;
};
