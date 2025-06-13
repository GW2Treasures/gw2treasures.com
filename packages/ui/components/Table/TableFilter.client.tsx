'use client';

import { createContext, useCallback, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { DropDown } from '../DropDown/DropDown';
import { MenuList } from '../Layout/MenuList';
import { Checkbox } from '../Form/Checkbox';
import { FlexRow } from '../Layout/FlexRow';
import { Button } from '../Form/Button';
import { Separator } from '../Layout/Separator';
import type { DataTableRowFilterComponent, DataTableRowFilterComponentProps } from './DataTable';
import type { TableFilterSearchIndex } from './TableFilter';
import { TextInput } from '../Form/TextInput';
import { isDefined } from '@gw2treasures/helper/is';
import { useDataTableInteracted } from './DataTable.client';

type FilterMode = 'or' | 'and';

interface TableFilterContext {
  filteredRows?: number[] | undefined,
  filterMap: Map<number | string, { name: string, rowIndexes: number[] }>,
  filterMode: FilterMode,

  filterIds: (number | string)[],
  setFilterIds: (filterIds: (number | string)[]) => void,

  searchIndex?: TableFilterSearchIndex,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
}

const context = createContext<TableFilterContext>({
  filteredRows: undefined,
  filterMap: new Map(),
  filterMode: 'or',
  filterIds: [],
  setFilterIds: () => {},
  searchQuery: '',
  setSearchQuery: () => {}
});

export interface TableFilterDefinition {
  id: number | string,
  name: string,
  rowIndexes: number[],
}

export interface TableFilterProviderProps {
  filter: TableFilterDefinition[],
  filterMode?: FilterMode,
  searchIndex?: TableFilterSearchIndex,
  children: ReactNode,
  language: string,
}

export const TableFilterProvider: FC<TableFilterProviderProps> = ({ children, filter, filterMode = 'or', searchIndex, language }) => {
  const filterMap = new Map(filter.map(({ id, ...filter }) => [id, filter]));
  const allFilterIds = filter.map(({ id }) => id);

  const [filterIds, setFilterIds] = useState(filterMode === 'or' ? allFilterIds : []);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRowsBySearch = (searchIndex !== undefined && searchQuery !== '')
    ? Object.entries(searchIndex).map(([string, indexes]) => string.toLocaleLowerCase(language).includes(searchQuery.toLocaleLowerCase(language)) ? indexes : []).flat(1)
    : undefined;

  const filteredRowsByFilter = filterMode === 'or'
    ? (filterIds.length !== allFilterIds.length
      ? filterIds.flatMap((id) => filterMap.get(id)?.rowIndexes ?? [])
      : undefined)
    : (filterIds.length > 0
      ? reduceOrUndefined(
        filterIds.map((id) => filterMap.get(id)?.rowIndexes).filter(isDefined),
        (common, indexes) => common.filter((i) => indexes.includes(i))
      ) : undefined);

  const filteredRows = filteredRowsBySearch === undefined && filteredRowsByFilter === undefined
    ? undefined
    : filteredRowsBySearch === undefined ? filteredRowsByFilter : filteredRowsByFilter === undefined ? filteredRowsBySearch : filteredRowsBySearch.filter((index) => filteredRowsByFilter.includes(index));

  return (
    <context.Provider value={{ filteredRows, filterIds, setFilterIds, filterMap, filterMode, searchIndex, searchQuery, setSearchQuery }}>
      {children}
    </context.Provider>
  );
};

/** Returns `undefined` if rows is empty, otherwise applies the reducer */
function reduceOrUndefined<T>(rows: T[], reducer: (prev: T, current: T) => T) {
  return rows.length > 0 ? rows.reduce(reducer) : undefined;
}

export const TableFilterRow: DataTableRowFilterComponent = ({ children, index }: DataTableRowFilterComponentProps) => {
  const { filteredRows } = useContext(context);
  const [interacted, setInteracted] = useDataTableInteracted();

  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  useEffect(() => {
    if(filteredRows !== undefined && !interacted) {
      setInteracted(true);
    }
  }, [filteredRows, interacted, setInteracted]);

  return <tr hidden={!isVisible}>{children}</tr>;
};

export interface TableFilterButtonProps {
  totalCount: number,
  children: ReactNode,
  all: ReactNode,
}

export const TableFilterButton: FC<TableFilterButtonProps> = ({ totalCount: count, children, all }) => {
  const { filterMap, filterIds, setFilterIds, filterMode } = useContext(context);

  const [isAltPressed, setIsAltPressed] = useState(false);

  // track alt key state
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if(e.key === 'Alt') {
        setIsAltPressed(true);
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if(e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', keyDown, { passive: true });
    window.addEventListener('keyup', keyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);

  const handleFilterChange = useCallback((filterId: number | string) => {
    // check if alt is pressed to isolate filter
    if(isAltPressed) {
      if(filterIds.length === 1 && filterIds[0] === filterId) {
        // if the clicked filter is the only active filter, invert all filters (select all except the clicked one)
        setFilterIds(Array.from(filterMap.keys()).filter((filter) => filter !== filterId));
      } else {
        // if the clicked filter is not the only active filter, select only the clicked filter
        setFilterIds([filterId]);
      }
    } else {
      // if alt is not pressed, toggle the clicked filter
      setFilterIds(toggleArray(filterIds, filterId));
    }
  }, [filterIds, filterMap, isAltPressed, setFilterIds]);

  return (
    <DropDown button={<Button icon={(filterMode === 'or' ? filterMap.size === filterIds.length : filterIds.length === 0) ? 'filter' : 'filter-active'}>{children}</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={filterIds.length > 0} indeterminate={filterIds.length < filterMap.size && filterIds.length > 0} onChange={() => setFilterIds(filterIds.length > 0 ? [] : Array.from(filterMap.keys()))}>
          <FlexRow align="space-between">
            {all}
            <span style={{ paddingLeft: 8 }}>{count}</span>
          </FlexRow>
        </Checkbox>
        <Separator/>
        {Array.from(filterMap.entries()).map(([filterId, filter]) => (
          <Checkbox key={filterId} checked={filterIds.includes(filterId)} onChange={() => handleFilterChange(filterId)}>
            <FlexRow align="space-between">
              <span>{filter.name}</span>
              <span style={{ paddingLeft: 8, color: filter.rowIndexes.length === 0 ? 'var(--color-text-muted)' : undefined }}>{filter.rowIndexes.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
        <Separator/>
        <span style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontSize: 14 }}>Tip: Hold <kbd style={{ border: '1px solid var(--color-border-dark)', borderRadius: 2, padding: '1px 3px' }}>Alt</kbd> to select a single filter</span>
      </MenuList>
    </DropDown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}


export interface TableSearchInputProps {
  placeholder?: string
}

export const TableSearchInput: FC<TableSearchInputProps> = ({ placeholder = 'Search…' }) => {
  const { searchQuery, setSearchQuery } = useContext(context);

  return <TextInput value={searchQuery} onChange={setSearchQuery} type="search" placeholder={placeholder}/>;
};
