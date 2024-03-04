import type { Scope } from '@gw2me/client';

export enum ErrorCode {
  NOT_LOGGED_IN,
  MISSING_PERMISSION,
  REAUTHORIZE,
}


export type FetchAccountResponse = {
  error: ErrorCode;
} | {
  error: undefined;
  accounts: Gw2Account[];
  scopes: Scope[];
};

export interface Gw2Account {
  id: string,
  name: string;
}


export type FetchAccessTokenResponse = {
  error: ErrorCode,
} | {
  error: undefined,
  accessTokens: Record<string, AccessToken>,
}

export type AccessToken = {
  accessToken: string,
  expiresAt: Date,
}
