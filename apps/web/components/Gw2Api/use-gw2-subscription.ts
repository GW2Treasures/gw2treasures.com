'use client';

import { useEffect, useMemo, useState } from 'react';
import { SubscriptionManager, type SubscriptionCallback, type SubscriptionResponse, type SubscriptionType } from './subscription-manager';
import type { WithLoadingState } from '@/lib/with';

// global subscription manager (client side only)
const manager = typeof window !== 'undefined' ? new SubscriptionManager() : null;

/** Hook to subscribe to gw2 account data */
export function useSubscribe<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>) {
  useEffect(
    () => manager?.subscribe(type, accountId, callback),
    [accountId, callback, type]
  );
}

/** Hook to use updating gw2 account data */
export function useSubscription<T extends SubscriptionType>(type: T, accountId: string): WithLoadingState<SubscriptionResponse<T>> {
  const [data, setData] = useState<SubscriptionResponse<T>>();

  useSubscribe(type, accountId, setData);

  return useMemo(
    () => data === undefined ? { loading: true } : { loading: false, ...data },
    [data]
  );
}
