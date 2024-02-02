import type { SessionUser } from '@/lib/getUser';
import { createContext } from 'react';

export interface UserContext {
  user: SessionUser | undefined;
}

export const UserContext = createContext<UserContext>({ user: undefined });
export const SetUserContext = createContext<(context: UserContext) => void>(() => {});
