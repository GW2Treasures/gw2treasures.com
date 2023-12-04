import { unstable_cache as nextCache } from 'next/cache';

export function cache<Args extends unknown[], Return>(cb: (...args: Args) => Promise<Return>, keyParts: string[], options?: {
  revalidate?: number | false;
  tags?: string[];
}): (...args: Args) => Promise<Return> {
  const cached = nextCache(
    async (...args: any) => { const data = JSON.stringify(await cb(...args), serialize); console.log('cache', data); return data; },
    [...keyParts, cb.toString()],
    options
  );

  return async (...args: Args) => JSON.parse(await cached(...args), deserialize);
};

function serialize(this: any, key: string, value: any) {
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

function deserialize(key: string, value: any) {
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
