import { Icon as DbIcon, IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, memo, useDeferredValue, useMemo, useState } from 'react';
import { localizedName } from '../../lib/localizedName';
import { DropDown } from '../DropDown/DropDown';
import { ItemLink } from '../Item/ItemLink';
import { Table } from '../Table/Table';
import { Discipline, DisciplineIcon, Disciplines } from './DisciplineIcon';
import { Ingredients } from './Ingredients';
import styles from './RecipeBox.module.css';

interface RecipeTableProps {
  recipes: (Recipe & {
    currentRevision: Revision,
    itemIngredients: (IngredientItem & { Item: Item & { icon?: DbIcon | null; }; })[]
    outputItem: (Item & { icon?: DbIcon | null; }) | null;
  })[]
};

export const EmptyDisciplineCounts: Record<Discipline, number> = {
  'Armorsmith': 0,
  'Artificer': 0,
  'Chef': 0,
  'Huntsman': 0,
  'Jeweler': 0,
  'Leatherworker': 0,
  'Scribe': 0,
  'Tailor': 0,
  'Weaponsmith': 0,
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}

export const RecipeTable: FC<RecipeTableProps> = ({ recipes }) => {
  const [search, setSearch] = useState('');
  const filter = useDeferredValue(search.toLowerCase());

  const { locale } = useRouter();

  const [disciplineFilter, setDisciplineFilter] = useState(Object.keys(EmptyDisciplineCounts));

  const disciplines = useMemo(() => recipes.reduce((sums, { disciplines }) => {
    return { ...sums, ...Object.fromEntries(disciplines.map((d) => [d, sums[d as Discipline] + 1])) };
  }, EmptyDisciplineCounts), [recipes]);

  return (
    <>
      <div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} type="search"/>
        <DropDown button={<button>Filter</button>}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>
              <input type="checkbox" checked={disciplineFilter.length > 0} onChange={() => setDisciplineFilter(disciplineFilter.length > 0 ? [] : Object.keys(EmptyDisciplineCounts))}/>
              All
            </label>
            {(Object.entries(disciplines) as [Discipline, number][]).map(([discipline, count]) => (
              <label key={discipline}>
                <input type="checkbox" checked={disciplineFilter.includes(discipline)} onChange={() => setDisciplineFilter(toggleArray(disciplineFilter, discipline))}/>
                <DisciplineIcon discipline={discipline}/>{discipline} ({count})
              </label>
            ))}
          </div>
        </DropDown>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Output</th>
            <th {...{ width: 1 }}>Rating</th>
            <th {...{ width: 1 }}>Disciplines</th>
            <th>Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {recipes.filter(({ outputItem, disciplines }) => (!filter || (outputItem && localizedName(outputItem, locale as any).toLowerCase().includes(filter))) && disciplines.some((discipline) => disciplineFilter.includes(discipline))).map((recipe) => (
            <RecipeTableRow key={recipe.id} recipe={recipe}/>
          ))}
        </tbody>
      </Table>
    </>
  );
};

interface RecipeTableRowProps {
  recipe: RecipeTableProps['recipes'][0]
};

const RecipeTableRow: FC<RecipeTableRowProps> = memo(function RTR({ recipe }) {
  return (
    <tr key={recipe.id}>
      <td>{recipe.outputItem ? (<ItemLink item={recipe.outputItem}/>) : 'Unknown'}</td>
      <td align="right">{recipe.rating}</td>
      <td><span className={styles.disciplines}>{recipe.disciplines.map((discipline) => <DisciplineIcon discipline={discipline as Discipline} key={discipline}/>)}</span></td>
      <td>
        <Ingredients recipe={recipe}/>
      </td>
    </tr>
  );
});

