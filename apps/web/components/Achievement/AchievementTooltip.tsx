import 'server-only';
import { ClientAchievementTooltip } from './AchievementTooltip.client';
import type { Language } from '@gw2treasures/database';
import { format } from 'gw2-tooltip-html';
import type { FC } from 'react';
import { parseIcon } from '@/lib/parseIcon';
import type { Achievement } from '@gw2api/types/data/achievement';

export interface AchievementTooltipProps {
  achievement: Achievement,
  language: Language,
  hideTitle?: boolean,
}

export const AchievementTooltip: FC<AchievementTooltipProps> = async ({ achievement, language, hideTitle }) => {
  const tooltip = await createTooltip(achievement, language);

  return (
    <ClientAchievementTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export function createTooltip(achievement: Achievement, language: Language): AchievementTooltip {
  return {
    language,
    name: achievement.name,
    icon: parseIcon(achievement.icon),
    description: format(achievement.description),
    requirement: format(achievement.requirement.replace('  ', ` ${achievement.tiers.at(-1)?.count ?? ''} `)),
    points: achievement.tiers?.reduce((total, { points }) => total + points, 0) ?? 0,
  };
}

export interface AchievementTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  description: string,
  requirement: string,
  points: number,
}
