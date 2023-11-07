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

export interface SkinLinkTooltipProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const SkinLinkTooltip: FC<SkinLinkTooltipProps> = ({ item, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  //const tooltip = useJsonFetch<ItemTooltip>(localizedUrl(`/item/${item.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className={rarityStyles[item.rarity]}>
      <div className={cx(styles.title)}>
        {item.icon && (<EntityIcon icon={item.icon} size={32}/>)}
        {localizedName(item, language)}
      </div>

      Skin
      {/* <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>}
        {!tooltip.loading && <ClientItemTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary> */}
    </div>
  );
};
