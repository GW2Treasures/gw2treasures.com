import { Icon as DbIcon, IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, memo, useDeferredValue, useMemo, useState } from 'react';
import Icon from '../../icons/Icon';
import { localizedName } from '../../lib/localizedName';
import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';
import { TextInput } from '../Form/TextInput';
import { ItemLink } from '../Item/ItemLink';
import { Separator } from '../Layout/Separator';
import { Table } from '../Table/Table';
import { Discipline, DisciplineIcon } from './DisciplineIcon';
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

const DisciplineNames = Object.keys(EmptyDisciplineCounts) as Discipline[];

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}

export const RecipeTable: FC<RecipeTableProps> = ({ recipes }) => {
  const [search, setSearch] = useState('');
  const filter = useDeferredValue(search.toLowerCase());

  const { locale } = useRouter();

  const [disciplineFilter, setDisciplineFilter] = useState(DisciplineNames);

  const disciplines = useMemo(() => recipes.reduce((sums, { disciplines }) => {
    return { ...sums, ...Object.fromEntries(disciplines.map((d) => [d, sums[d as Discipline] + 1])) };
  }, EmptyDisciplineCounts), [recipes]);

  return (
    <>
      <div>
        <TextInput value={search} onChange={setSearch} type="search" placeholder="Search…"/>
        <DropDown button={<Button><Icon icon={disciplineFilter.length === DisciplineNames.length ? 'filter' : 'filter-active'}/></Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ display: 'flex', gap: 4, alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 4, marginBottom: 4 }}>
              <input type="checkbox" checked={disciplineFilter.length > 0} onChange={() => setDisciplineFilter(disciplineFilter.length > 0 ? [] : DisciplineNames)}/>
              All
              <span style={{ marginLeft: 'auto', paddingLeft: 8 }}>{recipes.length}</span>
            </label>
            {(Object.entries(disciplines) as [Discipline, number][]).map(([discipline, count]) => (
              <label key={discipline} style={{ display: 'flex', gap: 4, alignItems: 'center', opacity: count === 0 ? 0.5 : 1 }}>
                <input type="checkbox" checked={disciplineFilter.includes(discipline)} onChange={() => setDisciplineFilter(toggleArray(disciplineFilter, discipline))}/>
                <DisciplineIcon discipline={discipline}/>{discipline}
                <span style={{ marginLeft: 'auto', paddingLeft: 8 }}>{count}</span>
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
          {recipes.map((recipe) => (
            <RecipeTableRow key={recipe.id} recipe={recipe} visible={(!filter || (!!recipe.outputItem && localizedName(recipe.outputItem, locale as any).toLowerCase().includes(filter))) && (recipe.disciplines.length === 0 || recipe.disciplines.some((discipline) => disciplineFilter.includes(discipline as Discipline)))}/>
          ))}
        </tbody>
      </Table>
    </>
  );
};

interface RecipeTableRowProps {
  recipe: RecipeTableProps['recipes'][0];
  visible: boolean;
};

const RecipeTableRow: FC<RecipeTableRowProps> = memo(function RecipeTableRow({ recipe, visible }) {
  return (
    <tr key={recipe.id} hidden={!visible}>
      <td>{recipe.outputItem ? (<ItemLink item={recipe.outputItem}/>) : 'Unknown'}</td>
      <td align="right">{recipe.rating}</td>
      <td><span className={styles.disciplines}>{recipe.disciplines.map((discipline) => <DisciplineIcon discipline={discipline as Discipline} key={discipline}/>)}</span></td>
      <td>
        <Ingredients recipe={recipe}/>
      </td>
    </tr>
  );
});

