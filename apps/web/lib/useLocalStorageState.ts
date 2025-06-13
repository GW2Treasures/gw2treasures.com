import { useEffect, useState } from 'react';
import { useHydrated } from './useHydrated';

export function useLocalStorageState<S = undefined>(key: string, initial: S | (() => S)) {
  const prefixedKey = `gw2t.${key}`;

  const [state, setState] = useState(initial);
  const hydrated = useHydrated();

  // load state from localStorage when hydrating
  useEffect(() => {
    const value = localStorage[prefixedKey];
    if(value) {
      setState(JSON.parse(value));
    }
  }, [prefixedKey]);

  useEffect(() => {
    // don't write to localStorage before hydration
    if(!hydrated) {
      return;
    }

    // if we have not written to localStorage yet and the value has not changed, skip writing to localStorage
    // this prevents writing to localStorage without user consent
    if(localStorage[prefixedKey] === undefined && state === initial) {
      return;
    }

    // write to localStorage
    localStorage.setItem(prefixedKey, JSON.stringify(state));
  }, [hydrated, initial, prefixedKey, state]);

  return [state, setState] as const;
}

/** Check if `useLocalStorageState` was persisted to localStorage. This only evaluates when running the hook and does not automatically update. */
export function useHasLocalStorageState(key: string) {
  const hydrated = useHydrated();

  return hydrated && localStorage[`gw2t.${key}`] !== undefined;
}
