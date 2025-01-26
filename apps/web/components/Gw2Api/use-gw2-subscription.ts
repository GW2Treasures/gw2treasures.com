'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SubscriptionManager, type SubscriptionCallback, type SubscriptionResponse, type SubscriptionType } from './subscription-manager';

export interface Gw2AccountSubscriptionProviderProps {
  children: ReactNode
}

const manager = new SubscriptionManager();

export function useSubscribe<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>) {
  useEffect(
    () => manager.subscribe(type, accountId, callback),
    [accountId, callback, type]
  );
}

type UseSubscriptionResult<T extends SubscriptionType> = { loading: true } | ({ loading: false } & SubscriptionResponse<T>);

export function useSubscription<T extends SubscriptionType>(type: T, accountId: string): UseSubscriptionResult<T> {
  const [data, setData] = useState<SubscriptionResponse<T>>();

  useSubscribe(type, accountId, setData);

  return useMemo(
    () => data === undefined ? { loading: true } : { loading: false, ...data },
    [data]
  );
}
