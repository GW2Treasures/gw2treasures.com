export type Undefined = undefined | null;
export type Falsy = false | 0 | -0 | 0n | '' | Undefined;

export function isUndefined(value: unknown): value is Undefined {
  return value == null;
}

export function isDefinied<T>(value: T | Undefined): value is T {
  return value != null;
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}

export function isFalsy(value: unknown): value is Falsy {
  return !value;
}
