import { useRef } from 'react';

export function useStableArray<T>(array: T[]): T[] {
  const ref = useRef(array);

  const stable = array.length === ref.current.length && array.every((value, i) => ref.current[i] === value)
    ? ref.current
    : (ref.current = array);

  return stable;
}
