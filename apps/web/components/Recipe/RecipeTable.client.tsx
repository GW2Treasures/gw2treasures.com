'use client';

import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import type { DataTableRowFilterComponent, DataTableRowFilterComponentProps } from '@gw2treasures/ui/components/Table/DataTable';
import { createContext, useState, type FC, type ReactNode, useContext, useEffect } from 'react';
import { useLanguage } from '../I18n/Context';
import { DisciplineIcon } from './DisciplineIcon';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import type { CraftingDiscipline } from '@gw2api/types/data/recipe';

const allDisciplines: CraftingDiscipline[] = [ 'Armorsmith', 'Artificer', 'Chef', 'Homesteader', 'Huntsman', 'Jeweler', 'Leatherworker', 'Scribe', 'Tailor', 'Weaponsmith' ];

interface RecipeTableContext {
  filteredRows?: number[] | undefined;
  recipeIndexByDiscipline: Partial<Record<CraftingDiscipline, number[]>>;

  search: string;
  setSearch: (search: string) => void;

  disciplines: CraftingDiscipline[];
  setDisciplines: (disciplines: CraftingDiscipline[]) => void;
}

const context = createContext<RecipeTableContext>({ search: '', setSearch: () => {}, recipeIndexByDiscipline: {}, disciplines: allDisciplines, setDisciplines: () => {} });

export interface RecipeTableProviderProps {
  recipeIndexByDiscipline: Partial<Record<CraftingDiscipline, number[]>>;
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

export const RecipeRowFilter: DataTableRowFilterComponent = ({ children, index }: DataTableRowFilterComponentProps) => {
  const { filteredRows } = useContext(context);
  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  return <tr hidden={!isVisible}>{children}</tr>;
};


export const RecipeTableSearch: FC = () => {
  const { search, setSearch } = useContext(context);

  return <TextInput value={search} onChange={setSearch} type="search" placeholder="Search…"/>;
};


export interface RecipeTableDisciplineFilterProps {
  totalCount: number;
}

export const RecipeTableDisciplineFilter: FC<RecipeTableDisciplineFilterProps> = ({ totalCount: count }) => {
  const { disciplines, setDisciplines, recipeIndexByDiscipline } = useContext(context);

  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if(e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if(e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', keyDown, { passive: true });
    window.addEventListener('keyup', keyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);

  return (
    <DropDown button={<Button icon={disciplines.length === allDisciplines.length ? 'filter' : 'filter-active'}>Filter</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={disciplines.length > 0} indeterminate={disciplines.length < allDisciplines.length && disciplines.length > 0} onChange={() => setDisciplines(disciplines.length > 0 ? [] : allDisciplines)}>
          <FlexRow align="space-between">
            All
            <span style={{ paddingLeft: 8 }}>{count}</span>
          </FlexRow>
        </Checkbox>
        <Separator/>
        {allDisciplines.map((discipline) => (
          <Checkbox key={discipline} checked={disciplines.includes(discipline)} onChange={() => isShiftPressed ? setDisciplines([discipline]) : setDisciplines(toggleArray(disciplines, discipline))}>
            <FlexRow align="space-between">
              <span><DisciplineIcon discipline={discipline}/> {discipline}</span>
              <span style={{ paddingLeft: 8, color: !recipeIndexByDiscipline[discipline] ? 'var(--color-text-muted)' : undefined }}>{recipeIndexByDiscipline[discipline]?.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
        <Separator/>
        <span style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Tip: Hold <kbd style={{ border: '1px solid var(--color-border-dark)', borderRadius: 2, padding: '1px 3px' }}>Shift</kbd> to select a single discipline</span>
      </MenuList>
    </DropDown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}
