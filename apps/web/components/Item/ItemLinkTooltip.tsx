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
import { useGw2Accounts } from '../Gw2Api/use-gw2-accounts';
import { Scope } from '@gw2me/client';
import { useInventoryItemTotal } from '../Inventory/use-inventory';
import type { Gw2Account } from '../Gw2Api/types';
import { Gw2AccountName } from '../Gw2Api/Gw2AccountName';
import { FormatNumber } from '../Format/FormatNumber';

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
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className={cx(styles.title)}>
              {item.icon && (<EntityIcon icon={item.icon} size={32}/>)}
              {localizedName(item, language)}
            </div>
            <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientItemTooltip tooltip={tooltip.data}/>}
        <ItemLinkTooltipInventories itemId={item.id}/>
      </ErrorBoundary>
    </div>
  );
};

const ItemLinkTooltipInventories: FC<{ itemId: number }> = ({ itemId }) => {
  const accounts = useGw2Accounts([Scope.GW2_Account, Scope.GW2_Characters, Scope.GW2_Inventories, Scope.GW2_Unlocks]);

  if(accounts.loading || accounts.error) {
    return null;
  }

  return (
    <ul className={styles.accountInventories}>
      {accounts.accounts.map((account) => <ItemLinkTooltipInventoryAccount key={account.id} itemId={itemId} account={account}/>)}
    </ul>
  );
};

const ItemLinkTooltipInventoryAccount: FC<{ account: Gw2Account, itemId: number }> = ({ account, itemId }) => {
  const inventory = useInventoryItemTotal(account.id, itemId);

  if(inventory.loading || inventory.error || inventory.count === 0) {
    return null;
  }

  return (
    <li>
      <span className={styles.accountName}><Gw2AccountName account={account}/></span>
      <FormatNumber value={inventory.count}/>
    </li>
  );
};
