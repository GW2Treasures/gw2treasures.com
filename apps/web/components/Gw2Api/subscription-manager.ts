import { fetchGw2Api, Gw2ApiError } from '@gw2api/fetch';
import type { Account } from '@gw2api/types/data/account';
import type { AccountAchievement } from '@gw2api/types/data/account-achievements';
import type { AccountHomesteadDecoration } from '@gw2api/types/data/account-homestead';
import type { AccountWallet } from '@gw2api/types/data/account-wallet';
import { accessTokenManager } from './access-token-manager';
import type { CharacterSab } from '@gw2api/types/data/character-sab';
import type { AccountWizardsVaultMetaObjectives, AccountWizardsVaultSpecialObjectives } from '@gw2api/types/data/account-wizardsvault';
import type { Response } from '@/lib/response';
import type { Language } from '@gw2treasures/database';

export type SubscriptionType = 'account'
  | 'achievements'
  | 'skins'
  | 'minis'
  | 'wallet'
  | 'wizards-vault.daily'
  | 'wizards-vault.weekly'
  | 'wizards-vault.special'
  | 'inventories'
  | 'home.nodes'
  | 'home.cats'
  | 'homestead.decorations'
  | 'homestead.glyphs'
  | 'colors'
  | 'dungeons'
  | 'raids'
  | 'sab'
  | 'outfits'
  | 'gliders';

export type SubscriptionData<T extends SubscriptionType> =
  T extends 'account' ? Account<'2019-12-19T00:00:00.000Z'> :
  T extends 'achievements' ? AccountAchievement[] :
  T extends 'skins' | 'minis' | 'colors' | 'outfits' | 'gliders' ? number[] :
  T extends 'wallet' ? AccountWallet[] :
  T extends 'wizards-vault.daily' | 'wizards-vault.weekly' ? AccountWizardsVaultMetaObjectives :
  T extends 'wizards-vault.special' ? AccountWizardsVaultSpecialObjectives :
  T extends 'inventories' ? Awaited<ReturnType<typeof loadInventories>> :
  T extends 'home.nodes' ? string[] :
  T extends 'home.cats' ? number[] :
  T extends 'homestead.decorations' ? AccountHomesteadDecoration[] :
  T extends 'homestead.glyphs' ? string[] :
  T extends 'dungeons' | 'raids' ? string[] :
  T extends 'sab' ? Record<string, CharacterSab> :
  never;

export type SubscriptionResponse<T extends SubscriptionType> = Response<{
  data: SubscriptionData<T>,
  timestamp: Date,
}>;

export type SubscriptionCallback<T extends SubscriptionType> = (response: SubscriptionResponse<T>) => void;

type ActiveSubscription<T extends SubscriptionType> = {
  type: T,
  language: Language,
  callback: SubscriptionCallback<T>,
};

export type CancelSubscription = () => void;

export class SubscriptionManager {
  #accounts = new Map<string, { state: SubscriptionState, manager: AccountSubscriptionManager }>();
  #state = { ...defaultState };
  #stateListeners = new Set<(state: SubscriptionState) => void>();

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
      account.manager.pause();
    }
  }

  resume() {
    console.debug('[SubscriptionManager] resume');

    for(const account of this.#accounts.values()) {
      account.manager.resume();
    }
  }

  onStateChange(callback: (state: SubscriptionState) => void) {
    this.#stateListeners.add(callback);

    return () => {
      this.#stateListeners.delete(callback);
    };
  }

  getState() {
    return this.#state;
  }

  #handleAccountStateChange(accountId: string, state: SubscriptionState) {
    this.#accounts.get(accountId)!.state = state;
    const mergedState = mergeStates(Array.from(this.#accounts.values()).map((account) => account.state));

    if(mergedState.loading !== this.#state.loading || mergedState.health !== this.#state.health) {
      this.#state = mergedState;
      this.#stateListeners.forEach((callback) => callback(mergedState));
    }
  }

  subscribe<T extends SubscriptionType>(type: T, accountId: string, language: Language, callback: SubscriptionCallback<T>): CancelSubscription {
    if(!this.#accounts.has(accountId)) {
      const manager = new AccountSubscriptionManager(accountId, document.visibilityState === 'hidden');
      manager.onAccountStateChange((state) => this.#handleAccountStateChange(accountId, state));
      this.#accounts.set(accountId, { state: { ...defaultState }, manager });
    }

    return this.#accounts.get(accountId)!.manager.subscribe(type, language, callback);
  }
}

export enum SubscriptionHealth {
  Good = 0,
  Slow = 1,
  Error = 2,
}

export interface SubscriptionState {
  loading: boolean,
  health: SubscriptionHealth,
}

const defaultState = {
  loading: false,
  health: SubscriptionHealth.Good,
};

export class AccountSubscriptionManager {
  #accountId: string;
  #paused = false;
  #subscriptions = new Set<ActiveSubscription<SubscriptionType>>();
  #timeouts = new Map<SubscriptionType, ReturnType<typeof setTimeout> | 0>();
  #cache: { [T in SubscriptionType]?: { timestamp: Date, data: SubscriptionData<T> }} = {};
  #errorCount = 0;

  #subscriptionStates = new Map<SubscriptionType, SubscriptionState>();
  #accountState: SubscriptionState = { ...defaultState };
  #accountStateListeners = new Set<(state: SubscriptionState) => void>();

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
    await this.#tick(subscription.type, subscription.language);
  }

  private setState(type: SubscriptionType, update: Partial<SubscriptionState>) {
    const newState = {
      ...defaultState,
      ...this.#subscriptionStates.get(type),
      ...update,
    };
    this.#subscriptionStates.set(type, newState);
    this.handleUpdateState();
  }

  private removeState(type: SubscriptionType) {
    this.#subscriptionStates.delete(type);
    this.handleUpdateState();
  }

  private handleUpdateState() {
    const previousState = this.#accountState;

    this.#accountState = mergeStates(Array.from(this.#subscriptionStates.values()));

    if(previousState.loading !== this.#accountState.loading || previousState.health !== this.#accountState.health) {
      this.#accountStateListeners.forEach((callback) => callback(this.#accountState));
    }
  }

  onAccountStateChange(callback: (state: SubscriptionState) => void) {
    this.#accountStateListeners.add(callback);

    return () => {
      this.#accountStateListeners.delete(callback);
    };
  }

  async #tick<T extends SubscriptionType>(type: T, language: Language) {
    console.debug(`[AccountSubscriptionManager(${this.#accountId})] tick`, type);

    // create timeout to mark slow requests
    let isSlow = false;
    const slowRequestTimeout = setTimeout(() => {
      isSlow = true;
      this.setState(type, { health: SubscriptionHealth.Slow });
    }, 5_000);

    // fetch data
    let response: SubscriptionResponse<SubscriptionType>;
    let nextTickMs = 60_000;
    try {
      // get access token
      const accessToken = await accessTokenManager.getAccessToken(this.#accountId);

      const timestamp = new Date();

      // set loading state
      this.setState(type, { loading: true });

      // fetch data
      const data = await fetchers[type](accessToken.accessToken, language);

      // write to cache
      this.#cache = { ...this.#cache, [type]: { data, timestamp }};

      // save cache to session storage
      sessionStorage.setItem(`gw2api.cache.${this.#accountId}`, JSON.stringify(this.#cache));

      // reset error count
      this.#errorCount = 0;

      // update state
      this.setState(type, { loading: false, health: isSlow ? SubscriptionHealth.Slow : SubscriptionHealth.Good });

      // create response
      response = { error: false, data, timestamp };
    } catch(e) {
      const cached = this.#cache[type];
      // if cached data is available, respond with it instead of showing an error
      // TODO: only respond with cached data if it is not too old
      response = cached ? { error: false, ...cached } : { error: true };

      // set error state
      this.setState(type, { loading: false, health: SubscriptionHealth.Error });

      // increase error count
      this.#errorCount++;

      const isRateLimitError = e instanceof Gw2ApiError && e.response.status === 429;
      const isApiDisabled = e instanceof Gw2ApiError && e.message.includes('API not active');

      // delay retry depending on error
      nextTickMs = isApiDisabled ? 5 * 60 * 1000 : // 5 minutes
        isRateLimitError ? 60_000 : // 1 minute
        Math.min(this.#errorCount * 5_000, 60_000); // 5s -> 1 minute

      console.warn(`[AccountSubscriptionManager(${this.#accountId})][${type}] error fetching data${cached ? ' (fallback to cached data)' : ''}\n`, e);
    }

    // clear slow timeout
    clearTimeout(slowRequestTimeout);

    // call callbacks
    this.#subscriptions.forEach((subscription) => {
      if(subscription.type === type) {
        subscription.callback(response);
      }
    });

    // schedule next tick
    if(!this.#paused) {
      const timeout = setTimeout(() => this.#tick(type, language), nextTickMs);
      this.#timeouts.set(type, timeout);
    }
  }

  subscribe<T extends SubscriptionType>(type: T, language: Language, callback: SubscriptionCallback<T>): CancelSubscription {
    const subscription: ActiveSubscription<T> = { type, language, callback };
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

      // TODO: handle last unsubscribe of a type (clear timeout and state)
    };
  }
}

const fetchers: { [T in SubscriptionType]: (accessToken: string, language: Language) => Promise<SubscriptionData<T>> } = {
  'account': (accessToken: string) => fetchGw2Api('/v2/account', { accessToken, schema: '2019-02-21T00:00:00.000Z', cache: 'no-cache' }),
  'achievements': (accessToken: string) => fetchGw2Api('/v2/account/achievements', { accessToken, cache: 'no-cache' }),
  'skins': (accessToken: string) => fetchGw2Api('/v2/account/skins', { accessToken, cache: 'no-cache' }),
  'minis': (accessToken: string) => fetchGw2Api('/v2/account/minis', { accessToken, cache: 'no-cache' }),
  'wallet': (accessToken: string) => fetchGw2Api('/v2/account/wallet', { accessToken, cache: 'no-cache' }),
  'wizards-vault.daily': (accessToken: string, language: Language) => fetchGw2Api('/v2/account/wizardsvault/daily', { accessToken, cache: 'no-cache', language }),
  'wizards-vault.weekly': (accessToken: string, language: Language) => fetchGw2Api('/v2/account/wizardsvault/weekly', { accessToken, cache: 'no-cache', language }),
  'wizards-vault.special': (accessToken: string, language: Language) => fetchGw2Api('/v2/account/wizardsvault/special', { accessToken, cache: 'no-cache', language }),
  'inventories': (accessToken: string) => loadInventories(accessToken),
  'home.cats': (accessToken: string) => fetchGw2Api('/v2/account/home/cats', { accessToken, cache: 'no-cache', schema: '2022-03-23T19:00:00.000Z' }),
  'home.nodes': (accessToken: string) => fetchGw2Api('/v2/account/home/nodes', { accessToken, cache: 'no-cache' }),
  'homestead.decorations': (accessToken: string) => fetchGw2Api('/v2/account/homestead/decorations', { accessToken, cache: 'no-cache' }),
  'homestead.glyphs': (accessToken: string) => fetchGw2Api('/v2/account/homestead/glyphs', { accessToken, cache: 'no-cache' }),
  'colors': (accessToken: string) => fetchGw2Api('/v2/account/dyes', { accessToken, cache: 'no-cache' }),
  'dungeons': (accessToken: string) => fetchGw2Api('/v2/account/dungeons', { accessToken, cache: 'no-cache' }),
  'raids': (accessToken: string) => fetchGw2Api('/v2/account/raids', { accessToken, cache: 'no-cache' }),
  'sab': (accessToken: string) => loadSab(accessToken),
  'outfits': (accessToken: string) => fetchGw2Api('/v2/account/outfits', { accessToken, cache: 'no-cache' }),
  'gliders': (accessToken: string) => fetchGw2Api('/v2/account/gliders', { accessToken, cache: 'no-cache' }),
};

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

function mergeStates(states: SubscriptionState[]): SubscriptionState {
  const mergedState: SubscriptionState = { ...defaultState };

  for (const state of states) {
    mergedState.loading ||= state.loading;
    mergedState.health = Math.max(mergedState.health, state.health);

    if (mergedState.loading && mergedState.health === SubscriptionHealth.Error) {
      break;
    }
  }

  return mergedState;
}
