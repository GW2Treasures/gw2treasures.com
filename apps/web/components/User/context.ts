import type { SessionUser } from '@/lib/getUser';
import { createContext } from 'react';

export interface UserContext {
  user: SessionUser | undefined;
  loading: boolean;
}

export const UserContext = createContext<UserContext>({ user: undefined, loading: true });
export const SetUserContext = createContext<(context: UserContext) => void>(() => {});
