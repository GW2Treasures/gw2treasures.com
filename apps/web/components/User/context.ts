import type { SessionUser } from '@/lib/getUser';
import { createContext } from 'react';

export type UserContext = Promise<SessionUser | undefined>;

const infinitePromise = new Promise<undefined>(() => {});

export const UserContext = createContext<UserContext>(infinitePromise);
