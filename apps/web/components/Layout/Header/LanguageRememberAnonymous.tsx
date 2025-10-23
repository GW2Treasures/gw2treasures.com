'use client';

import { CookieNotification } from '@/components/User/CookieNotification';
import { useUser } from '@/components/User/use-user';
import { createRememberLanguageCookie } from '@/lib/cookies';
import type { Language } from '@gw2treasures/database';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { type FC, useSyncExternalStore } from 'react';

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

const cookieStore = typeof window === 'undefined' ? null : new SyncCookieStore('gw2t-l');
const noop = () => () => {};
const getServerSnapshot = () => undefined;

export interface LanguageRememberAnonymousProps {
  language: Language,
}

export const LanguageRememberAnonymous: FC<LanguageRememberAnonymousProps> = ({ language }) => {
  const user = useUser();
  const rememberedLanguage = useSyncExternalStore(cookieStore?.subscribe ?? noop, cookieStore?.getSnapshot ?? getServerSnapshot, getServerSnapshot);

  if(user || !('cookieStore' in window)) {
    return null;
  }

  const handleChange = (remember: boolean) => {
    const cookie = createRememberLanguageCookie(language);

    if(remember) {
      window.cookieStore.set({
        ...cookie,
        expires: cookie.expires.getTime()
      });
    } else {
      window.cookieStore.delete({
        name: cookie.name,
        domain: cookie.domain,
        path: cookie.path,
      });
    }
  };

  return (
    <>
      <CookieNotification/>
      <Checkbox onChange={handleChange} checked={!!rememberedLanguage}>Remember Language</Checkbox>
      <Separator/>
    </>
  );
};
