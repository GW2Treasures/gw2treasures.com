'use client';

import { getAchievementObjectiveState } from '@/components/Achievement/AccountAchievementProgress';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { findMinutesUntilNext, type Schedule } from '@/components/Time/countdown';
import { useSynchronizedTime } from '@/components/Time/synchronized-time';
import { Waypoint } from '@/components/Waypoint/Waypoint';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import type { Achievement } from '@gw2treasures/database';
import { type FC, type ReactNode } from 'react';

const OBJECTIVES_PER_ACHIEVEMENT = 3;

export interface ChasingShadowsProgressProps {
  achievements: Pick<Achievement, 'id' | 'flags' | 'prerequisitesIds'>[],
  accountId: string,
}

export const ChasingShadowsProgress: FC<ChasingShadowsProgressProps> = ({ accountId, achievements }) => {
  const accountAchievements = useSubscription('achievements', accountId);

  if(accountAchievements.loading) {
    return <td><Skeleton/></td>;
  }

  if(accountAchievements.error) {
    return <td>Error loading account</td>;
  }

  const total = (achievements.length + 1) * OBJECTIVES_PER_ACHIEVEMENT;
  const current = achievements.reduce(
    (current, achievement) => {
      const state = getAchievementObjectiveState(accountAchievements.data, achievement.id, { flags: achievement.flags as AchievementFlags[], prerequisitesIds: achievement.prerequisitesIds });
      const progress = state.state === 'done' ? OBJECTIVES_PER_ACHIEVEMENT : state.state === 'progress' ? state.current : 0;
      return current + progress;
    },
    0
  );

  return (
    <ProgressCell progress={current / total}>
      <FormatNumber value={current}/> / <FormatNumber value={total}/>
    </ProgressCell>
  );
};


export interface ScheduledWaypoint {
  id: number,
  title: ReactNode,
  schedule: Schedule,
}

export interface FractalIncursionWaypointProps {
  waypoints: ScheduledWaypoint[],
}

export const FractalIncursionWaypoint: FC<FractalIncursionWaypointProps> = ({ waypoints }) => {
  const time = useSynchronizedTime();

  // don't render the timer on the server
  if(!time) {
    return <Skeleton width={64}/>;
  }

  // get minutes since midnight UTC
  const currentHours = time.getUTCHours();
  const currentMinutes = currentHours * 60 + time.getUTCMinutes();

  // keep waypoints active for 1 minute
  const activeMinutes = 1;

  // find the next waypoint
  const next = waypoints.reduce<{ minutes: number, waypoint?: Omit<ScheduledWaypoint, 'schedule'> }>((minimum, { schedule, ...waypoint }) => {
    const timeUntil = findMinutesUntilNext(currentMinutes + activeMinutes, [schedule]);

    return timeUntil < minimum.minutes
      ? { minutes: timeUntil, waypoint }
      : minimum;
  }, { minutes: Infinity, waypoint: undefined });

  return next.waypoint
    ? <Waypoint {...next.waypoint}/>
    : <Skeleton/>;
};
