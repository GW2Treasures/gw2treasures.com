import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, ms: number = 150): T {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(value);
      console.log('Set value to ', value);
    }, ms);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, ms]);

  return state;
}
