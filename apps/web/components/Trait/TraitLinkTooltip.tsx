'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Language, Trait } from '@gw2treasures/database';
import type { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import styles from './TraitTooltip.module.css';
import type { TraitTooltip } from './TraitTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { useJsonFetch } from '@/lib/useFetch';
import { ClientTraitTooltip } from './TraitTooltip.client';
import { localizedUrl } from '@/lib/localizedUrl';

export interface TraitLinkTooltipProps {
  trait: WithIcon<Pick<Trait, 'id' | keyof LocalizedEntity | 'slot'>>
  language?: Language;
  revision?: string;
}

export const TraitLinkTooltip: FC<TraitLinkTooltipProps> = ({ trait, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<TraitTooltip>(localizedUrl(`/traits/${trait.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className={cx(styles.title)}>
              {trait.icon && (<EntityIcon icon={trait.icon} size={32} type={trait.slot === 'Major' ? 'trait-major' : 'trait-minor'}/>)}
              {localizedName(trait, language)}
            </div>
            <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientTraitTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
