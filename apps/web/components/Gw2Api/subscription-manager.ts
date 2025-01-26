import { getResetDate } from '../Reset/ResetTimer';
import { fetchGw2Api, Gw2ApiError } from '@gw2api/fetch';
import type { AccountAchievement } from '@gw2api/types/data/account-achievements';
import type { AccountWallet } from '@gw2api/types/data/account-wallet';
import type { AccountHomesteadDecoration } from '@gw2api/types/data/account-homestead';
import { accessTokenManager } from './access-token-manager';

export type SubscriptionType = 'achievements' | 'skins' | 'minis' | 'wallet' | 'wizards-vault' | 'inventories' | 'home.nodes' | 'home.cats' | 'homestead.decorations' | 'homestead.glyphs';

export type SubscriptionData<T extends SubscriptionType> =
  T extends 'achievements' ? AccountAchievement[] :
  T extends 'skins' ? number[] :
  T extends 'minis' ? number[] :
  T extends 'wallet' ? AccountWallet[] :
  T extends 'wizards-vault' ? Awaited<ReturnType<typeof loadAccountsWizardsVault>> :
  T extends 'inventories' ? Awaited<ReturnType<typeof loadInventories>> :
  T extends 'home.nodes' ? string[] :
  T extends 'home.cats' ? number[] :
  T extends 'homestead.decorations' ? AccountHomesteadDecoration[] :
  T extends 'homestead.glyphs' ? string[] :
  never;

export type SubscriptionResponse<T extends SubscriptionType> = {
  error: false,
  data: SubscriptionData<T>
} | {
  error: true
};

export type SubscriptionCallback<T extends SubscriptionType> = (response: SubscriptionResponse<T>) => void;

type ActiveSubscription<T extends SubscriptionType> = {
  type: T,
  accountId: string,
  callback: SubscriptionCallback<T>
};

export type CancelSubscription = () => void;

export class SubscriptionManager {
  #paused = false;
  #subscriptions = new Set<ActiveSubscription<SubscriptionType>>();
  #timeouts = new Map<string, Map<SubscriptionType, NodeJS.Timeout | 0>>();
  #cache = new Map<string, { [T in SubscriptionType]?: SubscriptionData<T> }>();

  constructor() {
    // no additional setup required on the server
    if(typeof window === 'undefined') {
      return;
    }

    // restore cache from session storage
    const cache = sessionStorage.getItem('gw2api.cache');
    if(cache) {
      this.#cache = new Map(JSON.parse(cache));
    }

    // pause when the page is hidden
    this.#paused = document.visibilityState === 'hidden';
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'hidden') {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  pause() {
    if(this.#paused) {
      return;
    }

    console.debug('[SubscriptionManager] pause');
    this.#paused = true;

    for(const [, accountTimeouts] of this.#timeouts) {
      for(const [, timeout] of accountTimeouts) {
        clearTimeout(timeout);
      }
      accountTimeouts.clear();
    }
  }

  resume() {
    if(!this.#paused) {
      return;
    }

    console.debug('[SubscriptionManager] resume');
    this.#paused = false;

    this.#subscriptions.forEach((subscription) => this.#handleNewSubscription(subscription));
  }

  async #handleNewSubscription<T extends SubscriptionType>(subscription: ActiveSubscription<T>) {
    if(this.#hasTimeout(subscription) || this.#paused) {
      return;
    }

    // add fake timeout to prevent multiple subscriptions of the same type
    // the real timeout is only added after the first tick completed
    this.#timeouts.get(subscription.accountId)!.set(subscription.type, 0);

    // first tick
    await this.#tick(subscription.type, subscription.accountId);
  }

  #hasTimeout({ accountId, type }: ActiveSubscription<SubscriptionType>) {
    const accountTimeouts = this.#timeouts.get(accountId);

    if(!accountTimeouts) {
      this.#timeouts.set(accountId, new Map());
      return false;
    }

    // check if this is the first subscription of this type
    return accountTimeouts.has(type);
  }

  async #tick(type: SubscriptionType, accountId: string) {
    console.debug('[SubscriptionManager] tick', type, accountId);

    // get access token
    const accessToken = await accessTokenManager.getAccessToken(accountId);

    // fetch data
    let response: SubscriptionResponse<SubscriptionType>;
    let nextTickMs = 60_000;
    try {
      const data = await fetchers[type](accessToken.accessToken);

      // write to cache
      this.#cache.set(accountId, { ...this.#cache.get(accountId), [type]: data });

      // save cache to session storage
      sessionStorage.setItem('gw2api.cache', JSON.stringify(Array.from(this.#cache.entries())));

      response = { error: false, data };
    } catch(e) {
      const cached = this.#cache.get(accountId)?.[type];
      // if cached data is available, respond with it instead of showing an error
      // TODO: only respond with cached data if it is not too old
      response = cached ? { error: false, data: cached } : { error: true };

      const isRateLimitError = e instanceof Gw2ApiError && e.response.status === 429;
      if(!isRateLimitError) {
        // retry the errored request after 5 seconds, unless it was a rate limit error
        nextTickMs = 5_000;
      }

      console.warn('[SubscriptionManager] error fetching data' + (cached ? ' (fallback to cached data)' : ''), type, accountId, e);
    }

    // call callbacks
    this.#subscriptions.forEach((subscription) => {
      if(subscription.type === type && subscription.accountId === accountId) {
        subscription.callback(response);
      }
    });

    // schedule next tick
    if(!this.#paused) {
      const timeout = setTimeout(() => this.#tick(type, accountId), nextTickMs);
      this.#timeouts.get(accountId)!.set(type, timeout);
    }
  }

  subscribe<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>): CancelSubscription {
    const subscription = { type, accountId, callback };
    this.#subscriptions.add(subscription);

    // check if the data is already in cache
    if(this.#cache.has(accountId)) {
      const data = this.#cache.get(accountId)![type];

      if(data) {
        callback({ error: false, data });
      }
    } else {
      this.#cache.set(accountId, {});
    }

    // handle the new subscription
    this.#handleNewSubscription(subscription);

    // return a function to cancel the subscription
    return () => {
      this.#subscriptions.delete(subscription);
    };
  }
}

const fetchers: { [T in SubscriptionType]: (accessToken: string) => Promise<SubscriptionData<T>> } = {
  achievements: (accessToken: string) => fetchGw2Api('/v2/account/achievements', { accessToken, cache: 'no-cache' }),
  skins: (accessToken: string) => fetchGw2Api('/v2/account/skins', { accessToken, cache: 'no-cache' }),
  minis: (accessToken: string) => fetchGw2Api('/v2/account/minis', { accessToken, cache: 'no-cache' }),
  wallet: (accessToken: string) => fetchGw2Api('/v2/account/wallet', { accessToken, cache: 'no-cache' }),
  'wizards-vault': (accessToken: string) => loadAccountsWizardsVault(accessToken),
  inventories: (accessToken: string) => loadInventories(accessToken),
  'home.cats': (accessToken: string) => fetchGw2Api('/v2/account/home/cats', { accessToken, cache: 'no-cache', schema: '2022-03-23T19:00:00.000Z' }),
  'home.nodes': (accessToken: string) => fetchGw2Api('/v2/account/home/nodes', { accessToken, cache: 'no-cache' }),
  'homestead.decorations': (accessToken: string) => fetchGw2Api('/v2/account/homestead/decorations', { accessToken, cache: 'no-cache' }),
  'homestead.glyphs': (accessToken: string) => fetchGw2Api('/v2/account/homestead/glyphs', { accessToken, cache: 'no-cache' }),
};

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
  const [bank, materials, sharedInventory, armory, characters, delivery] = await Promise.all([
    fetchGw2Api('/v2/account/bank', { accessToken }),
    fetchGw2Api('/v2/account/materials', { accessToken }),
    fetchGw2Api('/v2/account/inventory', { accessToken }),
    fetchGw2Api('/v2/account/legendaryarmory', { accessToken }),
    fetchGw2Api('/v2/characters?ids=all', { accessToken, schema: '2022-03-23T19:00:00.000Z' }),
    fetchGw2Api('/v2/commerce/delivery', { accessToken }),
  ]);

  return {
    bank, materials, sharedInventory, armory, characters, delivery
  };
}
