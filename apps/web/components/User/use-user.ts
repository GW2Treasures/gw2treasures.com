import { use } from 'react';
import { UserContext } from './context';

export function useUser() {
  return use(UserContext);
}
