import type { Comparable, ComparableProperties } from './comparable-properties';

export function compare<T extends Comparable>(a: T, b: T): number {
  if(a == null) {
    if(b == null) {
      return 0;
    }
    return -1;
  }
  if(b == null) {
    return 1;
  }

  if(typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if((typeof a === 'number' || typeof a === 'bigint') && (typeof b === 'number' || typeof b === 'bigint')) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  if(a instanceof Date && b instanceof Date) {
    return a.valueOf() - b.valueOf();
  }

  throw new Error(`Cant compare ${typeof a} and ${typeof b}`);
}

export function sortBy<T>(by: ComparableProperties<T> | ((x: T) => Comparable)): (a: T, b: T) => number {
  return typeof by === 'function'
    ? (a, b) => compare(by(a), by(b))
    : (a, b) => compare(a[by] as Comparable, b[by] as Comparable);
}
