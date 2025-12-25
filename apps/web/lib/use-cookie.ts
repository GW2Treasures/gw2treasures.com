import { useMemo, useSyncExternalStore } from 'react';

class SyncCookieStore {
  private value: string | undefined;
  private subscriptions: Set<() => void> = new Set();

  constructor(private name: string) {
    // get initial value
    window.cookieStore.get(this.name).then((cookie) => {
      if(cookie) {
        this.value = cookie.value;
        this.subscriptions.forEach((callback) => callback());
      }
    });

    // listen for changes
    window.cookieStore.addEventListener('change', (event) => {
      const previousValue = this.value;

      for(const changedCookie of event.changed) {
        if(changedCookie.name === this.name) {
          this.value = changedCookie.value;
        }
      }
      for(const deletedCookie of event.deleted) {
        if(deletedCookie.name === this.name) {
          this.value = undefined;
        }
      }

      if(previousValue !== this.value) {
        this.subscriptions.forEach((callback) => callback());
      }
    });
  }

  getSnapshot = () => {
    return this.value;
  };

  subscribe = (onStoreChange: () => void) => {
    this.subscriptions.add(onStoreChange);

    return () => {
      this.subscriptions.delete(onStoreChange);
    };
  };
}

type CookieSetter = {
  /** Set the cookie to a value. */
  (value: string, options?: Omit<CookieInit, 'name' | 'value'>): void,

  /** Delete the cookie. */
  (value: undefined | null, options?: Omit<CookieStoreDeleteOptions, 'name'>): void,
};

type CookieValue = string | undefined;

export function useCookie(name: string): [CookieValue, CookieSetter] {
  const store = useMemo(() => new SyncCookieStore(name), [name]);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, () => undefined);

  const setValue: CookieSetter = (value, options) => {
    if(value === undefined || value === null) {
      window.cookieStore.delete({ ...options, name });
    } else {
      window.cookieStore.set({ ...options, name, value });
    }
  };

  return [value, setValue];
}
