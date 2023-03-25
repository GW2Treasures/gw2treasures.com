'use client';

import { cx } from '@/lib/classNames';
import { LocalizedEntity, localizedName } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { Item, Language } from '@prisma/client';
import { FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { ItemIcon } from './ItemIcon';
import styles from './ItemLinkTooltip.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';
import type { ItemTooltip } from './ItemTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { useJsonFetch } from '@/lib/useFetch';
import { ClientItemTooltip } from './ItemTooltip.client';

export interface ItemLinkTooltipProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  language?: Language;
}

export const ItemLinkTooltip: FC<ItemLinkTooltipProps> = ({ item, language }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<ItemTooltip>(`/item/${item.id}/tooltip`);

  return (
    <div className={rarityStyles[item.rarity]}>
      <div className={cx(styles.title)}>
        {item.icon && (<ItemIcon icon={item.icon} size={32}/>)}
        {localizedName(item, language)}
      </div>

      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && <Skeleton/>}
        {!tooltip.loading && <ClientItemTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
