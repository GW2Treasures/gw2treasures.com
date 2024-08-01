import { useEffect, useState } from 'react';
import { useHydrated } from './useHydrated';

export function useLocalStorageState<S = undefined>(key: string, initial: S | (() => S)) {
  const [state, setState] = useState(initial);
  const hydrated = useHydrated();

  useEffect(() => {
    if(localStorage[`gw2t.${key}`]) {
      setState(JSON.parse(localStorage[`gw2t.${key}`]));
    }
  }, [key]);

  useEffect(() => {
    if(!hydrated) {
      return;
    }

    localStorage.setItem(`gw2t.${key}`, JSON.stringify(state));
  }, [hydrated, key, state]);

  return [state, setState] as const;
}
