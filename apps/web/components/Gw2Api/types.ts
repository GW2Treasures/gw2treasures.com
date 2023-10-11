export enum ErrorCode {
  NOT_LOGGED_IN,
  MISSING_PERMISSION,
  REAUTHORIZE,
}

export type FetchAccountResponse = {
  error: ErrorCode;
} | {
  error: undefined;
  accounts: {
    name: string;
    subtoken: string;
  }[];
};
