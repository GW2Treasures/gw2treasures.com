import { use } from 'react';
import { UserContext } from './context';

export function useUser() {
  return use(useUserPromise());
}

export function useUserPromise() {
  return use(UserContext);
}
