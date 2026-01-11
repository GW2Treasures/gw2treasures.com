'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Item, Language } from '@gw2treasures/database';
import { Suspense, type FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import styles from './ItemLinkTooltip.module.css';
import rarityStyles from '../Layout/RarityColor.module.css';
import type { ItemTooltip } from './ItemTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientItemTooltip } from './ItemTooltip.client';
import { localizedUrl } from '@/lib/localizedUrl';
import { useGw2Accounts } from '../Gw2Api/use-gw2-accounts';
import { Scope } from '@gw2me/client';
import { useInventoryItemTotal } from '../Inventory/use-inventory';
import type { Gw2Account } from '../Gw2Api/types';
import { Gw2AccountName } from '../Gw2Api/Gw2AccountName';
import { FormatNumber } from '../Format/FormatNumber';
import { useJsonFetchPromise } from '@/lib/useFetch';
import { TradingPost } from './TradingPost';

export interface ItemLinkTooltipProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>,
  language?: Language,
  revision?: string,
}

export const ItemLinkTooltip: FC<ItemLinkTooltipProps> = ({ item, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetchPromise<ItemTooltip>(localizedUrl(`/item/${item.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className={rarityStyles[item.rarity]}>
      <ErrorBoundary fallback={<ItemLinkTooltipFallback item={item} language={language} error/>}>
        <Suspense fallback={<ItemLinkTooltipFallback item={item} language={language}/>}>
          <ClientItemTooltip tooltip={tooltip}/>
        </Suspense>
      </ErrorBoundary>
      <TradingPost itemId={item.id} className={styles.tradingPost} hideLoading compact/>
      <Suspense>
        <ItemLinkTooltipInventories itemId={item.id}/>
      </Suspense>
    </div>
  );
};

type ItemLinkTooltipInternalProps = ItemLinkTooltipProps & { language: Language, error?: boolean };

const ItemLinkTooltipFallback: FC<ItemLinkTooltipInternalProps> = ({ item, language, error }) => {
  return (
    <>
      <div className={cx(styles.title)}>
        {item.icon && (<EntityIcon icon={item.icon} size={32}/>)}
        {localizedName(item, language)}
      </div>
      {error ? (
        <div style={{ color: 'var(--color-error)' }}>Error loading tooltip</div>
      ) : (
        <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
      )}
    </>
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
      <FormatNumber className={styles.itemCount} value={inventory.count}/>
    </li>
  );
};
