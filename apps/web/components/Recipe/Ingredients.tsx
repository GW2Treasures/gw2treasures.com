import type { IngredientItem } from '@gw2treasures/database';
import { type FC, Fragment } from 'react';
import type { With } from '@/lib/with';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import styles from './Ingredients.module.css';

interface IngredientsProps {
  recipe: {
    itemIngredients: With<Pick<IngredientItem, 'count'>, { Item: ItemLinkProps['item'] }>[]
  }
};

export const Ingredients: FC<IngredientsProps> = ({ recipe }) => {
  return (
    <div className={styles.ingredients}>
      {recipe.itemIngredients.map((ingredient) => (
        <Fragment key={ingredient.Item.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <ItemLink item={ingredient.Item} icon={16}/>
        </Fragment>
      ))}
    </div>
  );
};
