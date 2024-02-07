export type Undefined = undefined | null;
export type Falsy = false | 0 | -0 | 0n | '' | Undefined;

export function isUndefined(value: unknown): value is Undefined {
  return value == null;
}

export function isDefined<T>(value: T | Undefined): value is T {
  return value != null;
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}

export function isFalsy(value: unknown): value is Falsy {
  return !value;
}

export function isEmptyObject(obj: unknown): obj is Record<string, never> {
  return typeof obj === 'object' && obj != undefined && Object.keys(obj).length === 0;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
