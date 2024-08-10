export function groupById<T extends { id: unknown }>(values: T[]): Map<T['id'], T> {
  const map = new Map<T['id'], T>();

  for(const value of values) {
    map.set(value.id, value);
  }

  return map;
}
