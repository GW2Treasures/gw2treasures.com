import { unstable_cache as nextCache } from 'next/cache';

export function cache<Args extends unknown[], Return>(cb: (...args: Args) => Promise<Return>, keyParts: string[], options?: {
  /** in seconds */
  revalidate?: number | false;
  tags?: string[];
}): (...args: Args) => Promise<Return> {
  const cached = nextCache(
    async (...args: Args) => JSON.stringify(await cb(...args), serialize),
    [...keyParts, cb.toString()],
    options
  );

  return async (...args: Args) => JSON.parse(await cached(...args), deserialize);
}

function serialize<T>(this: T, key: keyof T, value: unknown) {
  if(typeof value === 'bigint') {
    return '$n' + value.toString();
  }
  if(typeof value === 'undefined') {
    return '$u';
  }

  if(typeof value === 'string') {
    const originalValue = this[key];

    if(originalValue instanceof Date) {
      return '$D' + value;
    }

    if(value[0] === '$') {
      return '$' + value;
    }
  }

  return value;
}

function deserialize(key: string, value: unknown) {
  if(typeof value === 'string' && value[0] === '$') {
    switch(value[1]) {
      case '$': return value.substring(1);
      case 'n': return BigInt(value.substring(2));
      case 'D': return new Date(value.substring(2));
      case 'u': return undefined;
    }
  }

  return value;
}
