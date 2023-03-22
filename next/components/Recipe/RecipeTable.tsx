'use client';

import { IngredientItem, Recipe, Revision } from '@prisma/client';
import { FC, memo, useDeferredValue, useMemo, useState } from 'react';
import Icon from '../../icons/Icon';
import { localizedName } from '../../lib/localizedName';
import { With } from '../../lib/with';
import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';
import { Checkbox } from '../Form/Checkbox';
import { TextInput } from '../Form/TextInput';
import { Headline } from '../Headline/Headline';
import { useLanguage } from '../I18n/Context';
import { ItemLink, ItemLinkProps } from '../Item/ItemLink';
import { Separator } from '../Layout/Separator';
import { MenuList } from '../MenuList/MenuList';
import { Table } from '../Table/Table';
import { Discipline, DisciplineIcon } from './DisciplineIcon';
import { Ingredients } from './Ingredients';
import styles from './RecipeBox.module.css';

interface RecipeTableProps {
  recipes: With<Pick<Recipe, 'id' | 'rating' | 'disciplines'>, {
    currentRevision: Pick<Revision, 'data'>,
    itemIngredients: With<Pick<IngredientItem, 'count'>, { Item: ItemLinkProps['item'] }>[]
    outputItem: ItemLinkProps['item'] | null;
  }>[]
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

  const language = useLanguage();

  const [disciplineFilter, setDisciplineFilter] = useState(DisciplineNames);

  const disciplines = useMemo(() => recipes.reduce((sums, { disciplines }) => {
    return { ...sums, ...Object.fromEntries(disciplines.map((d) => [d, sums[d as Discipline] + 1])) };
  }, EmptyDisciplineCounts), [recipes]);

  return (
    <>
      <Headline id="crafting" actions={(
        <>
          <TextInput value={search} onChange={setSearch} type="search" placeholder="Search…"/>
          <DropDown button={<Button><Icon icon={disciplineFilter.length === DisciplineNames.length ? 'filter' : 'filter-active'}/> Filter</Button>}>
            <MenuList>
              <Checkbox checked={disciplineFilter.length > 0} indeterminate={disciplineFilter.length < DisciplineNames.length && disciplineFilter.length > 0} onChange={() => setDisciplineFilter(disciplineFilter.length > 0 ? [] : DisciplineNames)}>
                All
                <span style={{ marginLeft: 'auto', paddingLeft: 16 }}>{recipes.length}</span>
              </Checkbox>
              <Separator/>
              {(Object.entries(disciplines) as [Discipline, number][]).map(([discipline, count]) => (
                <Checkbox key={discipline} checked={disciplineFilter.includes(discipline)} onChange={() => setDisciplineFilter(toggleArray(disciplineFilter, discipline))}>
                  <DisciplineIcon discipline={discipline}/> {discipline}
                  <span style={{ marginLeft: 'auto', paddingLeft: 16, opacity: count === 0 ? 0.5 : 1 }}>{count}</span>
                </Checkbox>
              ))}
            </MenuList>
          </DropDown>
        </>
      )}
      >
        Used in crafting
      </Headline>

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
            <RecipeTableRow key={recipe.id} recipe={recipe} visible={(!filter || ((!!recipe.outputItem && localizedName(recipe.outputItem, language).toLowerCase().includes(filter)) || recipe.rating.toString() === filter)) && (recipe.disciplines.length === 0 || recipe.disciplines.some((discipline) => disciplineFilter.includes(discipline as Discipline)))}/>
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

