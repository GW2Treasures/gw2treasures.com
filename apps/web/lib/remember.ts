import chalk from 'chalk';

const logPrefix = (msg: any, ...params: any[]) => console.log(chalk.green('cache') + ' -', msg, ...params);

/** @deprecated */
export function remember<Args extends any[], Out>(seconds: number, callback: (...args: Args) => Out): (...args: Args) => Out {
  const log = (msg: any, ...params: any) => logPrefix(callback.name || 'anonymous', '-', msg, ...params);

  const cache = new Map<string, { value: Out, timestamp: number }>();

  const cleanup = () => {
    const now = performance.now();
    let deleted = 0;
    for(const [key, { timestamp }] of cache.entries()) {
      if(timestamp < now - (seconds * 1000)) {
        cache.delete(key);
        deleted++;
      }
    };

    if(deleted > 0) {
      log(`Cleaned up ${deleted} entries`);
    }
  };

  return (...args: Args) => {
    const key = JSON.stringify(args);
    const now = performance.now();
    const cached = cache.get(key);

    if(cached) {
      if(cached.timestamp > now - (seconds * 1000)) {
        log('used cached value', key);

        return cached.value;
      } else {
        log('cache stale', key);

        setTimeout(cleanup, 5);
      }
    }

    const value = callback(...args);

    cache.set(key, { value, timestamp: now });
    log('stored', key);

    return value;
  };
}
