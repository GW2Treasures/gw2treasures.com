import 'server-only';
import type { Gw2Api } from 'gw2-api-types';
import { ClientAchievementTooltip } from './AchievementTooltip.client';
import type { Language } from '@gw2treasures/database';
import { format } from 'gw2-tooltip-html';
import type { FC } from 'react';

export interface AchievementTooltipProps {
  achievement: Gw2Api.Achievement;
  language: Language;
}

export const AchievementTooltip: FC<AchievementTooltipProps> = async ({ achievement, language }) => {
  const tooltip = await createTooltip(achievement, language);

  return (
    <ClientAchievementTooltip tooltip={tooltip}/>
  );
};

export function createTooltip(achievement: Gw2Api.Achievement, language: Language): AchievementTooltip {
  return {
    language,
    description: format(achievement.description),
    requirement: format(achievement.requirement.replace('  ', ` ${achievement.tiers.at(-1)?.count ?? ''} `)),
    points: achievement.tiers?.reduce((total, { points }) => total + points, 0) ?? 0,
  };
}

export interface AchievementTooltip {
  language: Language,
  description: string,
  requirement: string,
  points: number,
}
