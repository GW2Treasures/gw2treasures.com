'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, MutableRefObject, ReactNode } from 'react';
import { fetchAccessTokens } from './fetch-accounts-action';
import { getResetDate } from '../Reset/ResetTimer';
import { useVisibilityState } from '@/lib/useVisibilityState';
import { fetchGw2Api } from '@gw2api/fetch';
import type { AccountAchievement } from '@gw2api/types/data/account-achievements';
import type { AccountWallet } from '@gw2api/types/data/account-wallet';

export interface Gw2AccountSubscriptionProviderProps {
  children: ReactNode
}

type SubscriptionType = 'achievements' | 'skins' | 'wallet' | 'wizards-vault' | 'inventories';

type SubscriptionData<T extends SubscriptionType> =
  T extends 'achievements' ? AccountAchievement[] :
  T extends 'skins' ? number[] :
  T extends 'wallet' ? AccountWallet[] :
  T extends 'wizards-vault' ? Awaited<ReturnType<typeof loadAccountsWizardsVault>> :
  T extends 'inventories'? Awaited<ReturnType<typeof loadInventories>> :
  never;

type SubscriptionResponse<T extends SubscriptionType> = {
  error: false,
  data: SubscriptionData<T>
} | {
  error: true
};

type SubscriptionCallback<T extends SubscriptionType> = (response: SubscriptionResponse<T>) => void;

type ActiveSubscription<T extends SubscriptionType> = {
  type: T,
  accountId: string,
  callback: SubscriptionCallback<T>
};

type CancelSubscription = () => void;

type Cache = {
  [T in SubscriptionType]?: Record<string, SubscriptionResponse<T>>
};

type SubscriptionContext<T extends SubscriptionType> = (type: T, accountId: string, callback: SubscriptionCallback<T>) => CancelSubscription;

const context = createContext<SubscriptionContext<SubscriptionType>>(() => () => {});

function hasType<T extends SubscriptionType>(type: T) {
  return (subscription: ActiveSubscription<SubscriptionType>): subscription is ActiveSubscription<T> => subscription.type === type;
}

export const Gw2AccountSubscriptionProvider: FC<Gw2AccountSubscriptionProviderProps> = ({ children }) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription<SubscriptionType>[]>([]);
  const activeTypes = useMemo(
    () => activeSubscriptions.reduce<Partial<Record<SubscriptionType, boolean>>>((active, { type }) => ({ ...active, [type]: true }), {}),
    [activeSubscriptions]
  );

  const cache = useRef<Cache>({});

  // TODO: persist access tokens to localStorage so we don't have to refetch on hard reload?
  const accessTokenCache = useRef<Record<string, { accessToken: string, expiresAt: Date } | undefined>>({});

  const setCache = <T extends SubscriptionType>(type: T, accountId: string, response: SubscriptionResponse<T> | undefined) => {
    cache.current = { ...cache.current, [type]: { ...cache.current[type], [accountId]: response }};
  };

  const getAccountIds = useCallback(async (subscriptions: ActiveSubscription<SubscriptionType>[]) => {
    // get all accounts with an active subscription
    const accountIds = Array.from(new Set(subscriptions.map(({ accountId }) => accountId)));

    // check which accounts we need to load, some accounts might still be cached
    const accountIdsToLoad = accountIds.filter((id) => accessTokenCache.current[id] === undefined || accessTokenCache.current[id]!.expiresAt < new Date());

    if(accountIdsToLoad.length > 0) {
      const fetchedAccessTokens = await fetchAccessTokens(accountIdsToLoad);

      // add the successfully fetched access tokens to the cache
      accountIdsToLoad.forEach((id) => {
        accessTokenCache.current[id] = fetchedAccessTokens.error === undefined ? fetchedAccessTokens.accessTokens[id] : undefined;
      });
    }

    return accountIds;
  }, []);

  const fetchData = async <T extends SubscriptionType>(type: T, callback: (accessToken: string) => Promise<SubscriptionData<T>>) => {
    // get all subscriptions for the type
    const subscriptions = activeSubscriptions.filter(hasType(type));

    const accountIds = await getAccountIds(subscriptions);

    // fetch data for each account
    const data: (SubscriptionResponse<T> & { accountId: string })[] = await Promise.all(accountIds.map(async (accountId) => {
      // get token from cache
      const accessToken = accessTokenCache.current[accountId];

      // check if token is valid
      if (!accessToken || accessToken.expiresAt < new Date()) {
        setCache(type, accountId, { error: true });
        return { accountId, error: true };
      }

      // call specific API based on the provided fetchFunction
      let data;
      try {
        data = await callback(accessToken.accessToken);
      } catch(e) {
        console.error(e);

        // if we have a cached entry lets return this, stale data is better then no data
        const cacheEntry = cache.current[type]?.[accountId];
        if(cacheEntry !== undefined) {
          return { accountId, ...cacheEntry };
        }

        // add error to cache
        setCache(type, accountId, { error: true });

        return { accountId, error: true };
      }

      // add to cache
      setCache(type, accountId, { error: false, data });

      return { accountId, error: false, data };
    }));

    const dataByAccount = new Map(data.map(({ accountId, ...data }) => [accountId, data]));

    for(const subscription of subscriptions) {
      subscription.callback(dataByAccount.get(subscription.accountId)!);
    }
  };

  useInterval(activeTypes.achievements, 60, fetchData.bind(null, 'achievements', achievementFetch));
  useInterval(activeTypes.skins, 60, fetchData.bind(null, 'skins', skinsFetch));
  useInterval(activeTypes.wallet, 60, fetchData.bind(null, 'wallet', walletFetch));
  useInterval(activeTypes['wizards-vault'], 60, fetchData.bind(null, 'wizards-vault', wizardsVaultFetch));
  useInterval(activeTypes.inventories, 60, fetchData.bind(null, 'inventories', inventoriesFetch));

  const subscribe = useCallback(<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>): CancelSubscription => {
    const subscription = { type, accountId, callback };

    // add to active subscriptions
    setActiveSubscriptions((activeSubscriptions) => [...activeSubscriptions, subscription]);

    // if we have cached data for this call the callback immediately
    const cacheEntry = cache.current[type]?.[accountId];
    if(cacheEntry !== undefined) {
      callback(cacheEntry);
    }

    // return callback to cancel subscription
    return () => {
      setActiveSubscriptions((activeSubscriptions) => activeSubscriptions.filter((activeSubscription) => activeSubscription !== subscription));
    };
  }, []);

  return (
    <context.Provider value={subscribe}>
      {children}
    </context.Provider>
  );
};

export function useSubscribe<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>) {
  const subscribe = useContext(context);

  useEffect(
    () => subscribe(type, accountId, callback),
    [accountId, callback, subscribe, type]
  );
}

type UseSubscriptionResult<T extends SubscriptionType> = { loading: true } | ({ loading: false } & SubscriptionResponse<T>);

export function useSubscription<T extends SubscriptionType>(type: T, accountId: string): UseSubscriptionResult<T> {
  const [data, setData] = useState<SubscriptionResponse<T>>();

  useSubscribe(type, accountId, setData);

  return data === undefined ? { loading: true } : { loading: false, ...data };
}

function useInterval(active: boolean = false, seconds: number, callback: () => void) {
  const callbackRef = useRefTo(callback);
  const activeRef = useRefTo(active);
  const visibility = useVisibilityState();
  const visibilityRef = useRefTo(visibility);

  const interval = useRef<ReturnType<typeof setInterval>>(undefined);

  // start interval
  useEffect(() => {
    if(active && visibility === 'visible' && interval.current === undefined) {
      interval.current = setInterval(() => {
        // if this should not be active anymore or the page is not visible stop the interval
        if(!activeRef.current || visibilityRef.current === 'hidden') {
          clearInterval(interval.current);
          interval.current = undefined;
          return;
        }

        // call callback
        callbackRef.current();
      }, seconds * 1000);

      // call callback immediately
      callbackRef.current();
    }
  }, [active, activeRef, callbackRef, seconds, visibility, visibilityRef]);

  useEffect(() => () => interval.current && clearInterval(interval.current), []);
}

function useRefTo<T>(to: T): MutableRefObject<T> {
  const ref = useRef(to);

  useEffect(() => {
    ref.current = to;
  }, [to]);

  return ref;
}

const achievementFetch = (accessToken: string) => fetchGw2Api('/v2/account/achievements', { accessToken, cache: 'no-cache' });
const skinsFetch = (accessToken: string) => fetchGw2Api('/v2/account/skins', { accessToken, cache: 'no-cache' });
const walletFetch = (accessToken: string) => fetchGw2Api('/v2/account/wallet', { accessToken, cache: 'no-cache' });
const wizardsVaultFetch = (accessToken: string) => loadAccountsWizardsVault(accessToken);
const inventoriesFetch = (accessToken: string) => loadInventories(accessToken);

async function loadAccountsWizardsVault(accessToken: string) {
  const account = await fetchGw2Api('/v2/account', { accessToken, schema: '2019-02-21T00:00:00.000Z', cache: 'no-cache' });

  const lastModified = new Date(account.last_modified);
  const lastModifiedToday = lastModified > getResetDate('last-daily');
  const lastModifiedThisWeek = lastModified > getResetDate('last-weekly');

  const [daily, weekly, special] = await Promise.all([
    lastModifiedToday ? fetchGw2Api('/v2/account/wizardsvault/daily', { accessToken, cache: 'no-cache' }) : undefined,
    lastModifiedThisWeek ? fetchGw2Api('/v2/account/wizardsvault/weekly', { accessToken, cache: 'no-cache' }) : undefined,
    fetchGw2Api('/v2/account/wizardsvault/special', { accessToken, cache: 'no-cache' }),
  ]);

  return {
    account,
    lastModifiedToday,
    lastModifiedThisWeek,
    daily, weekly, special
  };
}

async function loadInventories(accessToken: string) {
  const [bank, materials, sharedInventory, armory, characters] = await Promise.all([
    fetchGw2Api('/v2/account/bank', { accessToken }),
    fetchGw2Api('/v2/account/materials', { accessToken }),
    fetchGw2Api('/v2/account/inventory', { accessToken }),
    fetchGw2Api('/v2/account/legendaryarmory', { accessToken }),
    fetchGw2Api('/v2/characters?ids=all', { accessToken, schema: '2022-03-23T19:00:00.000Z' }),
  ]);

  return {
    bank, materials, sharedInventory, armory, characters
  };
}
