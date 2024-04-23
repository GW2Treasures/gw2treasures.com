import { isDefined } from '@gw2treasures/helper/is';

export function getIdsFromMap<K, V>(map: Map<K, V>, ids: K[]): V[] {
  return ids.map((id) => map.get(id)).filter(isDefined);
}

export function filterMap<K, V>(map: Map<K, V>, predicate: ([k, v]: [K, V]) => boolean): Map<K, V> {
  return new Map(Array.from(map.entries()).filter(predicate));
}

export function filterMapKeys<K, V>(map: Map<K, V>, keys: K[]): Map<K, V> {
  return filterMap(map, ([k]) => keys.includes(k));
}
