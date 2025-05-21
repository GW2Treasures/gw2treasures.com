'use client';

import { useInterval } from '@/lib/useInterval';
import { createContext, startTransition, use, useState, type FC, type ReactNode } from 'react';


// this context is used to used to have a single interval updating the time
// otherwise it could happen that the 4 timers update slightly offset
// TODO: maybe this could even be a global context also used for other timers on other pages?
const synchronizedTime = createContext<Date | undefined>(undefined);


export interface HologramStampedeProviderProps {
  children: ReactNode,
}

export const HologramStampedeProvider: FC<HologramStampedeProviderProps> = ({ children }) => {
  const [time, setTime] = useState<Date>();

  useInterval(() => {
    startTransition(() => setTime(new Date()));
  }, 1000);

  return (
    <synchronizedTime.Provider value={time}>
      {children}
    </synchronizedTime.Provider>
  );
};


export interface HologramStampedeNextTimerProps {
  schedule: 0 | 15 | 30 | 45,
  active: ReactNode,
}

export const HologramStampedeNextTimer: FC<HologramStampedeNextTimerProps> = ({ schedule, active }) => {
  const time = use(synchronizedTime);

  // don't render the timer on the server
  if(!time) {
    return null;
  }

  const currentMinute = time.getMinutes();

  // events are active for 5 minutes
  if(currentMinute >= schedule && currentMinute < schedule + 5) {
    return <strong>{active}</strong>;
  }

  const remainingMinutes = (60 + schedule - currentMinute - 1) % 60;
  const remainingSeconds = (60 - time.getSeconds() - 1) % 60;

  const Wrap = remainingMinutes < 10 ? 'strong' : 'span';

  return (
    <Wrap>
      in {remainingMinutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
    </Wrap>
  );
};
