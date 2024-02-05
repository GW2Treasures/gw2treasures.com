import type { GlobalColumnId } from './types';


export interface ItemTableHistoryState<ColumnId> {
  page?: number;
  orderBy?: { column: ColumnId, order: 'asc' | 'desc'}
}

export function getHistoryState<T = GlobalColumnId>(id: string): ItemTableHistoryState<T> {
  return typeof window !== 'undefined'
    ? window.history?.state[`itemTable.${id}`] ?? {}
    : {};
}

export function updateHistoryState<T = GlobalColumnId>(id: string, update: Partial<ItemTableHistoryState<T>>) {
  const currentState = getHistoryState(id);
  history.replaceState({ [`itemTable.${id}`]: { ...currentState, ...update }}, '');
}
