'use client';

import { useInterval } from '@/lib/useInterval';
import { createContext, startTransition, use, useState, type FC, type ReactNode } from 'react';

// this context is used to used to have a single interval updating the time
// otherwise it could happen that multiple timers update slightly offset
export const SynchronizedTimeContext = createContext<Date | undefined>(undefined);

export interface SynchronizedTimeProviderProps {
  children: ReactNode,
}

export const SynchronizedTimeProvider: FC<SynchronizedTimeProviderProps> = ({ children }) => {
  // the time is undefined during SSR to avoid hydration warnings and allow caching
  const [time, setTime] = useState<Date>();

  // TODO: stop interval if page is not visible (`useVisibilityState`)
  useInterval(() => {
    startTransition(() => setTime(new Date()));
  }, 1000);

  return (
    <SynchronizedTimeContext value={time}>
      {children}
    </SynchronizedTimeContext>
  );
};

export function useSynchronizedTime() {
  return use(SynchronizedTimeContext);
}
