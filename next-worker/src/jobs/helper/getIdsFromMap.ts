import { isDefined } from './types';

export function getIdsFromMap<K, V>(map: Map<K, V>, ids: K[]): V[] {
  return ids.map((id) => map.get(id)).filter(isDefined);
}
