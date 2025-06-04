import { fetchGw2Api, Gw2ApiError } from '@gw2api/fetch';
import type { Account } from '@gw2api/types/data/account';
import type { AccountAchievement } from '@gw2api/types/data/account-achievements';
import type { AccountHomesteadDecoration } from '@gw2api/types/data/account-homestead';
import type { AccountWallet } from '@gw2api/types/data/account-wallet';
import { getResetDate } from '../Reset/ResetTimer';
import { accessTokenManager } from './access-token-manager';
import type { CharacterSab } from '@gw2api/types/data/character-sab';

export type SubscriptionType = 'account'
  | 'achievements'
  | 'skins'
  | 'minis'
  | 'wallet'
  | 'wizards-vault'
  | 'inventories'
  | 'home.nodes'
  | 'home.cats'
  | 'homestead.decorations'
  | 'homestead.glyphs'
  | 'colors'
  | 'dungeons'
  | 'raids'
  | 'sab'
  | 'outfits';

export type SubscriptionData<T extends SubscriptionType> =
  T extends 'account' ? Account<'2019-12-19T00:00:00.000Z'> :
  T extends 'achievements' ? AccountAchievement[] :
  T extends 'skins' | 'minis' | 'colors' | 'outfits' ? number[] :
  T extends 'wallet' ? AccountWallet[] :
  T extends 'wizards-vault' ? Awaited<ReturnType<typeof loadAccountsWizardsVault>> :
  T extends 'inventories' ? Awaited<ReturnType<typeof loadInventories>> :
  T extends 'home.nodes' ? string[] :
  T extends 'home.cats' ? number[] :
  T extends 'homestead.decorations' ? AccountHomesteadDecoration[] :
  T extends 'homestead.glyphs' ? string[] :
  T extends 'dungeons' | 'raids' ? string[] :
  T extends 'sab' ? Record<string, CharacterSab> :
  never;

export type SubscriptionResponse<T extends SubscriptionType> = {
  error: false,
  data: SubscriptionData<T>
  timestamp: Date,
} | {
  error: true
};

export type SubscriptionCallback<T extends SubscriptionType> = (response: SubscriptionResponse<T>) => void;

type ActiveSubscription<T extends SubscriptionType> = {
  type: T,
  callback: SubscriptionCallback<T>
};

export type CancelSubscription = () => void;

export class SubscriptionManager {
  #accounts = new Map<string, AccountSubscriptionManager>();

  constructor() {
    // no additional setup required on the server
    if(typeof window === 'undefined') {
      return;
    }

    // pause when the page is hidden
    document.addEventListener('visibilitychange', () => {
      if(document.visibilityState === 'hidden') {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  pause() {
    console.debug('[SubscriptionManager] pause');

    for(const account of this.#accounts.values()) {
      account.pause();
    }
  }

  resume() {
    console.debug('[SubscriptionManager] resume');

    for(const account of this.#accounts.values()) {
      account.resume();
    }
  }

  subscribe<T extends SubscriptionType>(type: T, accountId: string, callback: SubscriptionCallback<T>): CancelSubscription {
    if(!this.#accounts.has(accountId)) {
      this.#accounts.set(accountId, new AccountSubscriptionManager(accountId, document.visibilityState === 'hidden'));
    }

    return this.#accounts.get(accountId)!.subscribe(type, callback);
  }
}

export class AccountSubscriptionManager {
  #accountId: string;
  #paused = false;
  #subscriptions = new Set<ActiveSubscription<SubscriptionType>>();
  #timeouts = new Map<SubscriptionType, NodeJS.Timeout | 0>();
  #cache: { [T in SubscriptionType]?: { timestamp: Date, data: SubscriptionData<T> }} = {};

  constructor(accountId: string, paused: boolean) {
    this.#accountId = accountId;
    this.#paused = paused;

    // restore cache from session storage
    const cache = sessionStorage.getItem(`gw2api.cache.${accountId}`);
    if(cache) {
      const cachedData = JSON.parse(cache);

      // deserialize and migrate timestamps
      for(const [key, value] of Object.entries(cachedData)) {
        if(typeof value !== 'object' || !value) { continue; }

        if(!('timestamp' in value)) {
          // migrate data without timestamp
          cachedData[key] = { timestamp: new Date(0), data: value };
        } else if(typeof value.timestamp === 'string') {
          // deserialize timestamp
          cachedData[key] = { ...value, timestamp: new Date(value.timestamp as string) };
        }
      }

      this.#cache = cachedData;
    }
  }

  pause() {
    if(this.#paused) {
      return;
    }

    this.#paused = true;

    for(const [, timeout] of this.#timeouts) {
      clearTimeout(timeout);
    }

    this.#timeouts.clear();
  }

  resume() {
    if(!this.#paused) {
      return;
    }

    this.#paused = false;

    this.#subscriptions.forEach((subscription) => this.#handleNewSubscription(subscription));
  }

  async #handleNewSubscription<T extends SubscriptionType>(subscription: ActiveSubscription<T>) {
    if(this.#timeouts.has(subscription.type) || this.#paused) {
      return;
    }

    // add fake timeout to prevent multiple subscriptions of the same type
    // the real timeout is only added after the first tick completed
    this.#timeouts.set(subscription.type, 0);

    // first tick
    await this.#tick(subscription.type);
  }

  async #tick<T extends SubscriptionType>(type: T) {
    console.debug(`[AccountSubscriptionManager(${this.#accountId})] tick`, type);

    // get access token
    const accessToken = await accessTokenManager.getAccessToken(this.#accountId);

    // fetch data
    let response: SubscriptionResponse<SubscriptionType>;
    let nextTickMs = 60_000;
    try {
      const timestamp = new Date();
      const data = await fetchers[type](accessToken.accessToken);

      // write to cache
      this.#cache = { ...this.#cache, [type]: { data, timestamp }};

      // save cache to session storage
      sessionStorage.setItem(`gw2api.cache.${this.#accountId}`, JSON.stringify(this.#cache));

      response = { error: false, data, timestamp };
    } catch(e) {
      const cached = this.#cache[type];
      // if cached data is available, respond with it instead of showing an error
      // TODO: only respond with cached data if it is not too old
      response = cached ? { error: false, ...cached } : { error: true };

      const isRateLimitError = e instanceof Gw2ApiError && e.response.status === 429;
      if(!isRateLimitError) {
        // retry the errored request after 5 seconds, unless it was a rate limit error
        nextTickMs = 5_000;
      }

      console.warn(`[AccountSubscriptionManager(${this.#accountId})] error fetching data` + (cached ? ' (fallback to cached data)' : ''), type, e);
    }

    // call callbacks
    this.#subscriptions.forEach((subscription) => {
      if(subscription.type === type) {
        subscription.callback(response);
      }
    });

    // schedule next tick
    if(!this.#paused) {
      const timeout = setTimeout(() => this.#tick(type), nextTickMs);
      this.#timeouts.set(type, timeout);
    }
  }

  subscribe<T extends SubscriptionType>(type: T, callback: SubscriptionCallback<T>): CancelSubscription {
    const subscription: ActiveSubscription<T> = { type, callback };
    this.#subscriptions.add(subscription);

    // check if the data is already in cache
    const cached = this.#cache[type];
    if(cached) {
      callback({ error: false, ...cached });
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
  account: (accessToken: string) => fetchGw2Api('/v2/account', { accessToken, schema: '2019-02-21T00:00:00.000Z', cache: 'no-cache' }),
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
  'colors': (accessToken: string) => fetchGw2Api('/v2/account/dyes', { accessToken, cache: 'no-cache' }),
  'dungeons': (accessToken: string) => fetchGw2Api('/v2/account/dungeons', { accessToken, cache: 'no-cache' }),
  'raids': (accessToken: string) => fetchGw2Api('/v2/account/raids', { accessToken, cache: 'no-cache' }),
  'sab': (accessToken: string) => loadSab(accessToken),
  'outfits': (accessToken: string) => fetchGw2Api('/v2/account/outfits', { accessToken, cache: 'no-cache' }),
};

async function loadAccountsWizardsVault(accessToken: string) {
  // TODO: somehow reuse subscription (maybe just extract logic into a `useWizardsVault` hook that subscribes to both)
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

async function loadSab(accessToken: string) {
  const characters = await fetchGw2Api('/v2/characters', { accessToken });

  const entries = await Promise.all(characters.map(
    (character) => fetchGw2Api(`/v2/characters/${character}/sab`, { accessToken, cache: 'no-cache' })
      .then((data) => [character, data] as const)
  ));

  return Object.fromEntries(entries);
}
