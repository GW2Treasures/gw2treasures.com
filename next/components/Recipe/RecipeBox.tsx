import { IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { FC } from 'react';
import Icon from '../../icons/Icon';
import { With, WithIcon } from '../../lib/with';
import { ItemLink } from '../Item/ItemLink';
import { Discipline, DisciplineIcon } from './DisciplineIcon';
import { Ingredients } from './Ingredients';
import styles from './RecipeBox.module.css';

interface RecipeBoxProps {
  recipe: Recipe & {
    currentRevision: Revision,
    itemIngredients: With<IngredientItem, { Item: WithIcon<Item> }>[]
  },
  outputItem: WithIcon<Item>
};

export const RecipeBox: FC<RecipeBoxProps> = ({ recipe, outputItem }) => {
  return (
    <div className={styles.box}>
      <div className={styles.title}>
        <ItemLink item={outputItem}/>
        {recipe.outputCount > 1 && ` ×${recipe.outputCount}`}
      </div>
      <div className={styles.info}>
        <span className={styles.disciplines}>
          {recipe.disciplines.map((discipline) => <DisciplineIcon key={discipline} discipline={discipline as Discipline}/>)}
        </span>
        <span className={styles.rating}>
          {recipe.rating}
        </span>
        <span className={styles.time}>
          {recipe.timeToCraftMs / 1000}s
        </span>
        <Icon icon="time"/>
      </div>
      <div className={styles.ingredients}>
        <Ingredients recipe={recipe}/>
      </div>
    </div>
  );
};
