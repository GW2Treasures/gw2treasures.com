'use client';

import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useSynchronizedTime } from '@/components/Time/synchronized-time';
import type { FC, ReactNode } from 'react';

export interface HologramStampedeNextTimerProps {
  schedule: 0 | 15 | 30 | 45,
  active: ReactNode,
}

export const HologramStampedeNextTimer: FC<HologramStampedeNextTimerProps> = ({ schedule, active }) => {
  const time = useSynchronizedTime();

  // don't render the timer on the server
  if(!time) {
    return <Skeleton width={64}/>;
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
