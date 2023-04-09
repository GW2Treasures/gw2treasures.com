import { LocalizedEntity } from '@/lib/localizedName';
import { IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { FC, Fragment } from 'react';
import { With, WithIcon } from '../../lib/with';
import { ItemLink, ItemLinkProps } from '../Item/ItemLink';
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
