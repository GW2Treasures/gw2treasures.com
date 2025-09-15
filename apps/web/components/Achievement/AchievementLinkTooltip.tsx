'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Achievement, Language } from '@gw2treasures/database';
import { Suspense, type FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './AchievementLinkTooltip.module.css';
import { useJsonFetchPromise } from '@/lib/useFetch';
import { localizedUrl } from '@/lib/localizedUrl';
import { Skeleton } from '../Skeleton/Skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import { AchievementTooltip } from './AchievementTooltip';
import { ClientAchievementTooltip } from './AchievementTooltip.client';

export interface AchievementLinkTooltipProps {
  achievement: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>>,
  language?: Language,
  revision?: string,
}

export const AchievementLinkTooltip: FC<AchievementLinkTooltipProps> = ({ achievement, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetchPromise<AchievementTooltip>(localizedUrl(`/achievement/${achievement.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));


  return (
    <div>
      <ErrorBoundary fallback={<AchievementLinkTooltipFallback achievement={achievement} language={language} error/>}>
        <Suspense fallback={<AchievementLinkTooltipFallback achievement={achievement} language={language}/>}>
          <ClientAchievementTooltip tooltip={tooltip} fallbackIcon={achievement.icon}/>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

type AchievementLinkTooltipInternalProps = AchievementLinkTooltipProps & { language: Language, error?: boolean };

const AchievementLinkTooltipFallback: FC<AchievementLinkTooltipInternalProps> = ({ achievement, language, error }) => {
  return (
    <>
      <div className={cx(styles.title)}>
        {achievement.icon && (<EntityIcon icon={achievement.icon} size={32}/>)}
        {localizedName(achievement, language)}
      </div>
      {error ? (
        <div style={{ color: 'var(--color-error)' }}>Error loading tooltip</div>
      ) : (
        <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
      )}
    </>
  );
};
