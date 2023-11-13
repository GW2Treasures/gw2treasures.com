'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Item, Language } from '@gw2treasures/database';
import type { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import styles from './ItemLinkTooltip.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';
import type { ItemTooltip } from './ItemTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { useJsonFetch } from '@/lib/useFetch';
import { ClientItemTooltip } from './ItemTooltip.client';
import { localizedUrl } from '@/lib/localizedUrl';

export interface ItemLinkTooltipProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const ItemLinkTooltip: FC<ItemLinkTooltipProps> = ({ item, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<ItemTooltip>(localizedUrl(`/item/${item.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className={rarityStyles[item.rarity]}>
      <div className={cx(styles.title)}>
        {item.icon && (<EntityIcon icon={item.icon} size={32}/>)}
        {localizedName(item, language)}
      </div>

      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>}
        {!tooltip.loading && <ClientItemTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
