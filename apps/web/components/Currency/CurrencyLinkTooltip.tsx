'use client';

import { cx } from '@gw2treasures/ui';
import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Currency, Language } from '@gw2treasures/database';
import { Suspense, type FC } from 'react';
import { useLanguage } from '../I18n/Context';
import { Skeleton } from '../Skeleton/Skeleton';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import styles from './CurrencyLinkTooltip.module.css';
import type { CurrencyTooltip } from './CurrencyTooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientCurrencyTooltip } from './CurrencyTooltip.client';
import { localizedUrl } from '@/lib/localizedUrl';
import { useGw2Accounts } from '../Gw2Api/use-gw2-accounts';
import { Scope } from '@gw2me/client';
import type { Gw2Account } from '../Gw2Api/types';
import { Gw2AccountName } from '../Gw2Api/Gw2AccountName';
import { useJsonFetchPromise } from '@/lib/useFetch';
import { useSubscription } from '../Gw2Api/use-gw2-subscription';
import { CurrencyValue } from './CurrencyValue';


export interface CurrencyLinkTooltipProps {
  currency: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>
  language?: Language;
  revision?: string;
}

export const CurrencyLinkTooltip: FC<CurrencyLinkTooltipProps> = ({ currency, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetchPromise<CurrencyTooltip>(localizedUrl(`/currency/${currency.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <ErrorBoundary fallback={<CurrencyLinkTooltipFallback currency={currency} language={language} error/>}>
        <Suspense fallback={<CurrencyLinkTooltipFallback currency={currency} language={language}/>}>
          <ClientCurrencyTooltip tooltip={tooltip}/>
        </Suspense>
      </ErrorBoundary>
      <Suspense>
        <CurrencyLinkTooltipInventories currencyId={currency.id}/>
      </Suspense>
    </div>
  );
};

type CurrencyLinkTooltipInternalProps = CurrencyLinkTooltipProps & { language: Language, error?: boolean };

const CurrencyLinkTooltipFallback: FC<CurrencyLinkTooltipInternalProps> = ({ currency, language, error }) => {
  return (
    <>
      <div className={cx(styles.title)}>
        {currency.icon && (<EntityIcon icon={currency.icon} size={32}/>)}
        {localizedName(currency, language)}
      </div>
      {error ? (
        <div style={{ color: 'var(--color-error)' }}>Error loading tooltip</div>
      ) : (
        <div className={styles.loading}><Skeleton/><br/><Skeleton width={120}/></div>
      )}
    </>
  );
};

const CurrencyLinkTooltipInventories: FC<{ currencyId: number }> = ({ currencyId: currencyId }) => {
  const accounts = useGw2Accounts([Scope.GW2_Wallet]);

  if(accounts.loading || accounts.error) {
    return null;
  }

  return (
    <ul className={styles.accountInventories}>
      {accounts.accounts.map((account) => <CurrencyLinkTooltipInventoryAccount key={account.id} currencyId={currencyId} account={account}/>)}
    </ul>
  );
};

const CurrencyLinkTooltipInventoryAccount: FC<{ account: Gw2Account, currencyId: number }> = ({ account, currencyId }) => {
  const wallet = useSubscription('wallet', account.id);

  if(wallet.loading || wallet.error) {
    return null;
  }

  const count = wallet.data.find(({ id }) => id === currencyId)?.value ?? 0;

  if(count === 0) {
    return null;
  }

  return (
    <li>
      <span className={styles.accountName}><Gw2AccountName account={account}/></span>
      <span className={styles.itemCount}><CurrencyValue value={count} currencyId={currencyId}/></span>
    </li>
  );
};
