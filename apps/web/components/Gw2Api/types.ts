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
};

export interface Gw2Account {
  name: string;
  subtoken: string;
}
