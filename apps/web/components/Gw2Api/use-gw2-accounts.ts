import { useContext } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';

export function useGw2Accounts() {
  const { accounts } = useContext(Gw2ApiContext);

  return accounts;
}
