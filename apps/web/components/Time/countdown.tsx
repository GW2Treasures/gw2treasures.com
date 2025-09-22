'use client';

import { mod } from '@gw2treasures/helper/modulo';
import type { FC, ReactNode } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { useSynchronizedTime } from './synchronized-time';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';

export interface Schedule {
  /** UTC offset in minutes */
  offset: number,

  /** Repeats after in minutes */
  repeat?: number,
}

export interface CountDownProps {
  schedule: Schedule | Schedule[],

  /** Highlight time (bold) if next event is within `highlightNextMinutes` minutes */
  highlightNextMinutes?: number,

  /** How many minutes the event stays active for and renders `active` instead of a countdown */
  activeDurationMinutes: number,

  /** Node to render when the event is active */
  active: ReactNode,

  sortable?: boolean,
}

export const CountDown: FC<CountDownProps> = ({ schedule, highlightNextMinutes, activeDurationMinutes, active, sortable }) => {
  // ensure schedule is always an array
  const schedules = Array.isArray(schedule) ? schedule : [schedule];

  const time = useSynchronizedTime();

  // at least one schedule is required
  if(schedules.length === 0) {
    return '-';
  }

  // don't render the timer on the server
  if(!time) {
    return <Skeleton width={64}/>;
  }

  // get minutes since midnight UTC
  const currentHours = time.getUTCHours();
  const currentMinutes = currentHours * 60 + time.getUTCMinutes();

  // calculate how many minutes have passed since the last event
  const minutesSinceLast = findMinutesSinceLast(currentMinutes, schedules);

  // render active component if event is active
  const isActive = minutesSinceLast >= 0 && minutesSinceLast < activeDurationMinutes;
  if(isActive) {
    return sortable
      ? (<SortableDynamicDataTableCell value={0}>{active}</SortableDynamicDataTableCell>)
      : active;
  }

  // calculate next event
  const minutesUntilNext = findMinutesUntilNext(currentMinutes, schedules);

  // split time into hours/minutes/seconds
  const remainingHours = Math.floor((minutesUntilNext - 1) / 60);
  const remainingMinutes = (60 + minutesUntilNext - 1) % 60;
  const remainingSeconds = (60 - time.getSeconds() - 1) % 60;

  // highlight countdown
  const Wrap = highlightNextMinutes && minutesUntilNext <= highlightNextMinutes ? 'strong' : 'span';

  const content = (
    <Wrap>
      in {remainingHours > 0 ? remainingHours + ':' : ''}{zeroPad(remainingMinutes)}:{zeroPad(remainingSeconds)}
    </Wrap>
  );

  return sortable
    ? (<SortableDynamicDataTableCell value={minutesUntilNext}>{content}</SortableDynamicDataTableCell>)
    : content;
};

function zeroPad(number: number) {
  return number.toString().padStart(2, '0');
}

const MINUTES_PER_DAY = 24 * 60;

/** Returns the minutes since the last event in schedules */
export function findMinutesSinceLast(currentMinutes: number, schedules: Schedule[]): number {
  return schedules.reduce((minSince, { offset, repeat }) => {
    const since = repeat
      // repeating events
      ? mod(currentMinutes - offset, repeat)
      // one-time events (wrap to yesterday if in the future)
      : currentMinutes >= offset
        ? currentMinutes - offset
        : currentMinutes + MINUTES_PER_DAY - offset;

    return Math.min(minSince, since);
  }, MINUTES_PER_DAY);
}

/** Returns the minutes until the next event in schedules */
export function findMinutesUntilNext(currentMinutes: number, schedules: Schedule[]): number {
  return schedules.reduce((minUntil, { offset, repeat }) => {
    const until = repeat
      // repeating events
      ? mod(offset - currentMinutes, repeat)
      // one-time events (wrap to tomorrow if in the past)
      : currentMinutes <= offset
        ? offset - currentMinutes
        : offset + MINUTES_PER_DAY - currentMinutes;

    return Math.min(minUntil, until);
  }, MINUTES_PER_DAY);
}
