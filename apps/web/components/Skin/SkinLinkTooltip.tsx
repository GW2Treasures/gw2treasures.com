'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Item, Language } from '@gw2treasures/database';
import type { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './SkinLinkTooltip.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';
import { useJsonFetch } from '@/lib/useFetch';
import { localizedUrl } from '@/lib/localizedUrl';
import { ErrorBoundary } from 'react-error-boundary';
import type { SkinTooltip } from './SkinTooltip';
import { ClientSkinTooltip } from './SkinTooltip.client';
import { Skeleton } from '../Skeleton/Skeleton';

export interface SkinLinkTooltipProps {
  skin: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const SkinLinkTooltip: FC<SkinLinkTooltipProps> = ({ skin, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<SkinTooltip>(localizedUrl(`/skin/${skin.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className={rarityStyles[skin.rarity]}>
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className={cx(styles.title)}>
              {skin.icon && (<EntityIcon icon={skin.icon} size={32}/>)}
              {localizedName(skin, language)}
            </div>
            <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientSkinTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
