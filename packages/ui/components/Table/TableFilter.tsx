// re-export client components
export * from './TableFilter.client';

export type TableFilterSearchIndex = Record<string, number[]>;

export function createSearchIndex<T>(values: T[], mapToSearchTerms: (value: T) => string | string[]): TableFilterSearchIndex {
  const searchIndex: Record<string, number[]> = {};

  for(let i = 0; i < values.length; i++) {
    const terms = toArray(mapToSearchTerms(values[i]));

    for(const term of terms) {
      if(!searchIndex[term]) {
        searchIndex[term] = [];
      }

      searchIndex[term].push(i);
    }
  }

  return searchIndex;
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
