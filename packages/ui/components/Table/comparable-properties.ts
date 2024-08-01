// eslint is disabled in this file, because eslint can't parse this file
// (TypeError: Cannot use 'in' operator to search for 'type' in undefined)

export type Comparable = string | number | bigint | null | undefined | Date;

export type ComparableProperties<T> = { [K in keyof T]: T[K] extends Comparable ? K : never }[keyof T];
