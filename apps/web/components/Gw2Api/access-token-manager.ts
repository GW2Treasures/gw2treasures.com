import { createPromiseWithResolvers } from '@/lib/promise';
import { fetchAccessTokens } from './fetch-accounts-action';
import type { AccessToken } from './types';

interface Queue {
  promise: Promise<void>,
  accountIds: Set<string>,
}

export class AccessTokenManager {
  #accessTokens = new Map<string, AccessToken>();
  #queue?: Queue;

  async getAccessToken(accountId: string): Promise<AccessToken> {
    const accessToken = this.#accessTokens.get(accountId);

    if(!accessToken || accessToken.expiresAt < new Date()) {
      return await this.#fetchAccessToken(accountId);
    }

    return accessToken;
  }

  async #fetchAccessToken(accountId: string): Promise<AccessToken> {
    if(this.#queue === undefined) {
      const { promise, resolve, reject } = createPromiseWithResolvers<void>();

      // create a new queue
      this.#queue = {
        promise,
        accountIds: new Set([accountId]),
      };

      // wait a tick to batch multiple access tokens to single request
      await Promise.resolve();

      // get all queued access tokens and clear the queue
      const queuedAccountIds = Array.from(this.#queue.accountIds);
      this.#queue = undefined;

      console.debug(`[AccessTokenManager] Fetching access tokens for ${queuedAccountIds.length} accounts`);

      // fetch all queued access tokens
      const response = await fetchAccessTokens(queuedAccountIds);

      if(response.error !== undefined) {
        const error = new Error('Failed to fetch access token');
        reject(error);
        throw error;
      }

      // store the fetched access tokens
      for(const accountId of queuedAccountIds) {
        this.#accessTokens.set(accountId, response.accessTokens[accountId]);
      }

      // notify other queued access token requests
      resolve();

      // return the access token
      return this.#accessTokens.get(accountId)!;
    } else {
      this.#queue.accountIds.add(accountId);

      // wait for the current queue to finish
      await this.#queue.promise;

      // the access token is now fetched, we can return it
      return this.#accessTokens.get(accountId)!;
    }
  }
}

export const accessTokenManager = new AccessTokenManager();
