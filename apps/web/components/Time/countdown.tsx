'use client';

import type { FC, ReactNode } from 'react';
import { useSynchronizedTime } from './synchronized-time';
import { Skeleton } from '../Skeleton/Skeleton';

export interface CountDownProps {
  /** UTC offset of repeating event */
  offsetMinutes: number,

  /** How many minutes between repeats */
  repeatMinutes: number,

  /** Highlight time (bold) if next event is within `highlightNextMinutes` minutes */
  highlightNextMinutes?: number,

  /** How many minutes the event stays active for and renders `active` instead of a countdown */
  activeDurationMinutes: number,

  /** Node to render when the event is active */
  active: ReactNode,
}

export const CountDown: FC<CountDownProps> = ({ offsetMinutes, repeatMinutes, highlightNextMinutes, activeDurationMinutes, active }) => {
  const time = useSynchronizedTime();

  // don't render the timer on the server
  if(!time) {
    return <Skeleton width={64}/>;
  }

  // get minutes since midnight UTC
  const currentHours = time.getUTCHours();
  const currentMinutes = currentHours * 60 + time.getUTCMinutes();

  // calculate how many minutes have passed since the last event
  const minutesSinceLast = (currentMinutes - offsetMinutes) % repeatMinutes;

  // render active component if event is active
  const isActive = minutesSinceLast < activeDurationMinutes;
  if(isActive) {
    return active;
  }

  // calculate next event
  const minutesUntilNext = repeatMinutes - minutesSinceLast;

  const remainingHours = Math.floor((minutesUntilNext - 1) / 60);
  const remainingMinutes = (60 + minutesUntilNext - 1) % 60;
  const remainingSeconds = (60 - time.getSeconds() - 1) % 60;

  // highlight countdown
  const Wrap = highlightNextMinutes && remainingMinutes < highlightNextMinutes ? 'strong' : 'span';

  return (
    <Wrap>
      in {remainingHours > 0 ? remainingHours + ':' : ''}{zeroPad(remainingMinutes)}:{zeroPad(remainingSeconds)}
    </Wrap>
  );
};

function zeroPad(number: number) {
  return number.toString().padStart(2, '0');
}
