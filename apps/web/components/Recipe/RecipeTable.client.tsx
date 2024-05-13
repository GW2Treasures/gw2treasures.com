'use client';

import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import type { DataTableRowFilterComponent } from '@gw2treasures/ui/components/Table/DataTable';
import { createContext, useState, type FC, type ReactNode, useContext } from 'react';
import { useLanguage } from '../I18n/Context';
import { DisciplineIcon, type Discipline } from './DisciplineIcon';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

const allDisciplines: Discipline[] = [ 'Armorsmith', 'Artificer', 'Chef', 'Huntsman', 'Jeweler', 'Leatherworker', 'Scribe', 'Tailor', 'Weaponsmith' ];

interface RecipeTableContext {
  filteredRows?: number[] | undefined;
  recipeIndexByDiscipline: Partial<Record<Discipline, number[]>>;

  search: string;
  setSearch: (search: string) => void;

  disciplines: Discipline[];
  setDisciplines: (disciplines: Discipline[]) => void;
}

const context = createContext<RecipeTableContext>({ search: '', setSearch: () => {}, recipeIndexByDiscipline: {}, disciplines: allDisciplines, setDisciplines: () => {} });

export interface RecipeTableProviderProps {
  recipeIndexByDiscipline: Partial<Record<Discipline, number[]>>;
  recipeNamesSearchIndex: Record<string, number[]>;
  children: ReactNode;
}

export const RecipeTableProvider: FC<RecipeTableProviderProps> = ({ children, recipeNamesSearchIndex, recipeIndexByDiscipline }) => {
  const [search, setSearch] = useState('');
  const [disciplines, setDisciplines] = useState(allDisciplines);
  const language = useLanguage();

  const filteredRowsBySearch = search !== ''
    ? Object.entries(recipeNamesSearchIndex).map(([string, indexes]) => string.toLocaleLowerCase(language).includes(search.toLocaleLowerCase(language)) ? indexes : []).flat(1)
    : undefined;

  const filteredRowsByDiscipline = disciplines.length !== allDisciplines.length
    ? disciplines.flatMap((discipline) => recipeIndexByDiscipline[discipline] ?? [])
    : undefined;

  const filteredRows = filteredRowsBySearch === undefined && filteredRowsByDiscipline === undefined
    ? undefined
    : filteredRowsBySearch === undefined ? filteredRowsByDiscipline : filteredRowsByDiscipline === undefined ? filteredRowsBySearch : filteredRowsBySearch.filter((index) => filteredRowsByDiscipline.includes(index));

  return (
    <context.Provider value={{ filteredRows, recipeIndexByDiscipline, search, setSearch, disciplines, setDisciplines }}>
      {children}
    </context.Provider>
  );
};

export const RecipeRowFilter: DataTableRowFilterComponent = ({ children, index }) => {
  const { filteredRows } = useContext(context);
  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  return <tr hidden={!isVisible}>{children}</tr>;
};


export interface RecipeTableSearchProps {}

export const RecipeTableSearch: FC<RecipeTableSearchProps> = ({ }) => {
  const { search, setSearch } = useContext(context);

  return <TextInput value={search} onChange={setSearch} type="search" placeholder="Search…"/>;
};


export interface RecipeTableDisciplineFilterProps {
  totalCount: number;
}

export const RecipeTableDisciplineFilter: FC<RecipeTableDisciplineFilterProps> = ({ totalCount: count }) => {
  const { disciplines, setDisciplines, recipeIndexByDiscipline } = useContext(context);

  return (
    <DropDown button={<Button icon={disciplines.length === allDisciplines.length ? 'filter' : 'filter-active'}>Filter</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={disciplines.length > 0} indeterminate={disciplines.length < allDisciplines.length && disciplines.length > 0} onChange={() => setDisciplines(disciplines.length > 0 ? [] : allDisciplines)}>
          All
          <span style={{ marginLeft: 'auto', paddingLeft: 16 }}>{count}</span>
        </Checkbox>
        <Separator/>
        {allDisciplines.map((discipline) => (
          <Checkbox key={discipline} checked={disciplines.includes(discipline)} onChange={() => setDisciplines(toggleArray(disciplines, discipline))}>
            <FlexRow align="space-between">
              <span><DisciplineIcon discipline={discipline}/> {discipline}</span>
              <span style={{ paddingLeft: 8, color: !recipeIndexByDiscipline[discipline] ? 'var(--color-text-muted)' : undefined }}>{recipeIndexByDiscipline[discipline]?.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
      </MenuList>
    </DropDown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}
