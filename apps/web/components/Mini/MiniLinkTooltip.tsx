'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Mini, Language } from '@gw2treasures/database';
import type { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './MiniLinkTooltip.module.css';
import { useJsonFetch } from '@/lib/useFetch';
import { localizedUrl } from '@/lib/localizedUrl';
import { ErrorBoundary } from 'react-error-boundary';
import type { MiniTooltip } from './MiniTooltip';
import { ClientMiniTooltip } from './MiniTooltip.client';
import { Skeleton } from '../Skeleton/Skeleton';

export interface MiniLinkTooltipProps {
  mini: WithIcon<Pick<Mini, 'id' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const MiniLinkTooltip: FC<MiniLinkTooltipProps> = ({ mini, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<MiniTooltip>(localizedUrl(`/minis/${mini.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className={cx(styles.title)}>
              {mini.icon && (<EntityIcon icon={mini.icon} size={32}/>)}
              {localizedName(mini, language)}
            </div>
            <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientMiniTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
