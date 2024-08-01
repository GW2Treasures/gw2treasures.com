import type { Scope } from '@gw2me/client';

export enum ErrorCode {
  NOT_LOGGED_IN,
  MISSING_PERMISSION,
  REAUTHORIZE,
}

export type ErrorResponse = {
  error: ErrorCode
};

export type FetchAccountSuccessResponse = {
  error: undefined;
  accounts: Gw2Account[];
  scopes: Scope[];
};

export interface Gw2Account {
  id: string;
  name: string;
  verified?: boolean;
  displayName?: string | null;
}

export interface Gw2AccountWithHidden extends Gw2Account {
  hidden: boolean;
}

export type FetchAccountResponse = ErrorResponse | FetchAccountSuccessResponse;


export type FetchAccessTokenResponse = ErrorResponse | {
  error: undefined,
  accessTokens: Record<string, AccessToken>,
};

export type AccessToken = {
  accessToken: string,
  expiresAt: Date,
};
