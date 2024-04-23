'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Language, Skill } from '@gw2treasures/database';
import type { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import styles from './SkillTooltip.module.css';
import type { SkillTooltip } from './SkillTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { useJsonFetch } from '@/lib/useFetch';
import { ClientSkillTooltip } from './SkillTooltip.client';
import { localizedUrl } from '@/lib/localizedUrl';

export interface SkillLinkTooltipProps {
  skill: WithIcon<Pick<Skill, 'id' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const SkillLinkTooltip: FC<SkillLinkTooltipProps> = ({ skill, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<SkillTooltip>(localizedUrl(`/skill/${skill.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className={cx(styles.title)}>
              {skill.icon && (<EntityIcon icon={skill.icon} size={32} type="skill"/>)}
              {localizedName(skill, language)}
            </div>
            <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientSkillTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
