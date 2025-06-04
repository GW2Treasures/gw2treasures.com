'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SubscriptionManager, type SubscriptionCallback, type SubscriptionData, type SubscriptionResponse, type SubscriptionType } from './subscription-manager';
import type { WithLoadingState } from '@/lib/with';
import { getResetDate, type Reset } from '../Reset/ResetTimer';

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

export function useAccountModificationDate(accountId: string): WithLoadingState<{ error: true } | { error: false, date: Date }> {
  const account = useSubscription('account', accountId);

  return useMemo(
    () => !account.loading && !account.error
      ? { loading: false, error: false, date: new Date(account.data.last_modified) }
      : account,
    [account]
  );
}

export function useSubscriptionWithReset<T extends SubscriptionType>(type: T, accountId: string, reset: Reset, empty: SubscriptionData<T>): WithLoadingState<SubscriptionResponse<T>> {
  const response = useSubscription(type, accountId);
  const lastModified = useAccountModificationDate(accountId);

  // use ref for empty so it doesn't update the useMemo on every call, as it is often an inline array
  const emptyRef = useRef(empty);

  return useMemo(() => {
    // TODO: write a useResetDate() hook to automatically update this
    const resetDate = getResetDate(reset);

    if(response.loading || lastModified.loading) {
      return { loading: true };
    }

    if(response.error || lastModified.error) {
      return { loading: false, error: true };
    }

    // the response is only good, if
    // - the account was modified after the reset date
    // - the response was received after the reset date
    const isAfterReset = lastModified.date >= resetDate && response.timestamp >= resetDate;

    if(!isAfterReset) {
      return { loading: false, error: false, timestamp: response.timestamp, data: emptyRef.current };
    }

    return response;
  }, [lastModified, reset, response]);
}
