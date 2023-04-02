import { isTruthy } from './is';

export function compareRevision<T extends Record<string, unknown>>(newData: T, existingData: T): {
  changed: boolean;
  description: string;
  added: string[];
  updated: string[];
  removed: string[];
} {
  const newKeys = Object.keys(newData);
  const existingKeys = Object.keys(existingData);

  const removed = existingKeys.filter((key) => !newKeys.includes(key));

  const { added, updated } = newKeys.reduce<{ added: string[], updated: string[] }>(
    (changes, key) => {

      if(!(key in existingData)) {
        return {
          ...changes,
          added: [...changes.added, key]
        };
      }

      if(key === 'details') {
        const detailChanges = compareRevision(newData[key] as Record<string, unknown>, existingData[key] as Record<string, unknown>);

        if(!detailChanges.changed) {
          return changes;
        }

        return {
          added: [...changes.added, ...detailChanges.added],
          updated: [...changes.updated, ...detailChanges.updated]
        };
      }

      if(JSON.stringify(existingData[key]) !== JSON.stringify(newData[key])) {
        return { ...changes, updated: [...changes.updated, key] };
      }

      return changes;
    },
    { added: [], updated: [] }
  );

  const totalChanges = removed.length + added.length + updated.length;

  const description = totalChanges > 3 ? 'Updated in API' : uppercaseFirst([
    added.length > 0 && `added: ${added.join(', ')}`,
    updated.length > 0 && `updated: ${updated.join(', ')}`,
    removed.length > 0 && `removed: ${removed.join(', ')}`,
  ].filter(isTruthy).join('; '));

  return {
    changed: totalChanges > 0,
    description,
    added,
    updated,
    removed
  };
}

function uppercaseFirst(value: string) {
  if(value.length === 0) {
    return value;
  }

  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
