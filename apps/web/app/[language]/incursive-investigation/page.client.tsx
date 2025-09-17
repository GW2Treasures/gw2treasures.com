'use client';

import { getAchievementObjectiveState } from '@/components/Achievement/AccountAchievementProgress';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import type { Achievement } from '@gw2treasures/database';
import { type FC } from 'react';

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

  const total = achievements.length * OBJECTIVES_PER_ACHIEVEMENT;
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
