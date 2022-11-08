import { Icon as DbIcon, IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { FC } from 'react';
import { ItemLink } from '../Item/ItemLink';
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

export const RecipeTable: FC<RecipeTableProps> = ({ recipes }) => {
  return (
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
          <tr key={recipe.id}>
            <td>{recipe.outputItem ? (<ItemLink item={recipe.outputItem}/>) : 'Unknown'}</td>
            <td align="right">{recipe.rating}</td>
            <td><span className={styles.disciplines}>{recipe.disciplines.map((discipline) => <DisciplineIcon discipline={discipline as Discipline} key={discipline}/>)}</span></td>
            <td>
              <Ingredients recipe={recipe}/>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
