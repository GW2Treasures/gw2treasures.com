export function groupById<T extends { id: unknown }>(values: T[]): Map<T['id'], T> {
  return groupByUnique(values, 'id');
}

export function groupByUnique<T, K extends keyof T>(values: T[], key: K): Map<T[K], T> {
  const map = new Map<T[K], T>();

  for(const value of values) {
    map.set(value[key], value);
  }

  return map;
}

export function groupBy<T, K extends keyof T>(values: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();

  for(const value of values) {
    if(map.has(value[key])) {
      map.get(value[key])!.push(value);
    } else {
      map.set(value[key], [value]);
    }
  }

  return map;
}
