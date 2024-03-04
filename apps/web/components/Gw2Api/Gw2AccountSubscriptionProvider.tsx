'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, MutableRefObject, ReactNode } from 'react';
import { fetchAccessTokens } from './fetch-accounts-action';

export interface Gw2AccountSubscriptionProviderProps {
  children: ReactNode
}

type SubscriptionType = 'achievements' | 'wizards-vault';

type SubscriptionData<T extends SubscriptionType> =
  T extends 'achievements' ? Gw2ApiAccountProgression :
  T extends 'wizards-vault' ? {} :
  never

type SubscriptionResponse<T extends SubscriptionType> = {
  error: false,
  data: SubscriptionData<T>
} | {
  error: true
}

type SubscriptionCallback<T extends SubscriptionType> = (response: SubscriptionResponse<T>) => void;

type ActiveSubscription<T extends SubscriptionType> = {
  type: T,
  accountId: string,
  callback: SubscriptionCallback<T>
}

type CancelSubscription = () => void;

type Cache = {
  [T in SubscriptionType]?: Record<string, SubscriptionResponse<T>>
}

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
    cache.current = { ...cache.current, [type]: { ...cache.current.achievements, [accountId]: response }};
  };

  useInterval(activeTypes.achievements, 60, useCallback(async () => {
    // get all achievement subscriptions
    const subscriptions = activeSubscriptions.filter(hasType('achievements'));

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

    // fetch achievement progress for each account
    const data = await Promise.all(accountIds.map(async (accountId): Promise<SubscriptionResponse<'achievements'> & { accountId: string }> => {
      // get token from cache
      const accessToken = accessTokenCache.current[accountId];

      // check if token is valid
      if(!accessToken || accessToken.expiresAt < new Date()) {
        setCache('achievements', accountId, { error: true });
        return { accountId, error: true };
      }

      // call gw2 api
      const response = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${accessToken.accessToken}`, { redirect: 'manual' });

      // check if response is ok
      if(!response.ok) {
        setCache('achievements', accountId, { error: true });
        return { accountId, error: true };
      }

      // get response content
      const data: Gw2ApiAccountProgression = await response.json();

      // add to cache
      setCache('achievements', accountId, { error: false, data });

      return { accountId, error: false, data };
    }));

    const dataByAccount = new Map(data.map(({ accountId, ...data }) => [accountId, data]));

    for(const subscription of activeSubscriptions.filter(hasType('achievements'))) {
      subscription.callback(dataByAccount.get(subscription.accountId)!);
    }
  }, [activeSubscriptions]));

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

  const interval = useRef<ReturnType<typeof setInterval>>();

  // start interval
  useEffect(() => {
    if(active && interval.current === undefined) {
      interval.current = setInterval(() => {
        // if this should not be active anymore stop the interval
        if(!activeRef.current) {
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
  }, [active, activeRef, callbackRef, seconds]);

  useEffect(() => () => interval.current && clearInterval(interval.current), []);
}

function useRefTo<T>(to: T): MutableRefObject<T> {
  const ref = useRef(to);

  useEffect(() => {
    ref.current = to;
  }, [to]);

  return ref;
}

type Gw2ApiAccountProgression = {
  id: number,
  current: number,
  max: number,
  done: boolean,
  bits?: number[],
  repeated?: number,
}[];
