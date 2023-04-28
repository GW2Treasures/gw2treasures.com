'use client';

import { cx } from '@gw2treasures/ui';
import { LocalizedEntity, localizedName } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { Achievement, Language } from '@gw2treasures/database';
import { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './AchievementLinkTooltip.module.css';
import { useJsonFetch } from '@/lib/useFetch';
import { localizedUrl } from '@/lib/localizedUrl';
import { Skeleton } from '../Skeleton/Skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import { AchievementTooltip } from './AchievementTooltip';
import { ClientAchievementTooltip } from './AchievementTooltip.client';

export interface AchievementLinkTooltipProps {
  achievement: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const AchievementLinkTooltip: FC<AchievementLinkTooltipProps> = ({ achievement, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<AchievementTooltip>(localizedUrl(`/achievement/${achievement.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <div className={cx(styles.title)}>
        {achievement.icon && (<EntityIcon icon={achievement.icon} size={32}/>)}
        {localizedName(achievement, language)}
      </div>

      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>}
        {!tooltip.loading && <ClientAchievementTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
