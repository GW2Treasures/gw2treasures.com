import { createContext, use, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

const noop = () => {};

export function createContextState<T>(defaultValue: T, localStorageKey: string | false = false) {
  const Context = createContext<readonly [T, Dispatch<SetStateAction<T>>]>(
    [defaultValue, noop]
  );

  const useMaybeLocalStorageState = localStorageKey
    ? (useLocalStorageState<T>).bind(null, localStorageKey)
    : (useState<T>);

  const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const state = useMaybeLocalStorageState(defaultValue);

    return (
      <Context value={state}>
        {children}
      </Context>
    );
  };

  const useValue = () => {
    const [value] = use(Context);
    return value;
  };

  return { context: Context, Provider, useValue };
}
