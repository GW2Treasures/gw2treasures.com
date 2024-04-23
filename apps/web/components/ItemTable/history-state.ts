import type { GlobalColumnId } from './types';


export interface ItemTableHistoryState<ColumnId> {
  page?: number;
  orderBy?: { column: ColumnId, order: 'asc' | 'desc'}
}

export function getState() {
  return typeof window !== 'undefined'
    ? window.history?.state ?? {}
    : {};
}

export function getHistoryState<T = GlobalColumnId>(id: string): ItemTableHistoryState<T> {
  return getState()[`itemTable.${id}`] ?? {};
}

export function updateHistoryState<T = GlobalColumnId>(id: string, update: Partial<ItemTableHistoryState<T>>) {
  const state = getState();
  const currentState = getHistoryState(id);
  history.replaceState({ ...state, [`itemTable.${id}`]: { ...currentState, ...update }}, '');
}
