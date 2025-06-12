import { createContext, use, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from 'react';

const noop = () => {};

export function createContextState<T>(defaultValue: T) {
  const Context = createContext<[T, Dispatch<SetStateAction<T>>]>(
    [defaultValue, noop]
  );

  const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const state = useState(defaultValue);

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
