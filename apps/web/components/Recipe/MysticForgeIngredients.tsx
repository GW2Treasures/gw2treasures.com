import type { MysticForgeIngredientItem } from '@gw2treasures/database';
import { type FC, Fragment } from 'react';
import type { With } from '@/lib/with';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import styles from './Ingredients.module.css';

interface MysticForgeIngredientsProps {
  recipe: {
    itemIngredients: With<Pick<MysticForgeIngredientItem, 'count' | 'id'>, { Item: ItemLinkProps['item'] }>[],
  },
}

export const MysticForgeIngredients: FC<MysticForgeIngredientsProps> = ({ recipe }) => {
  return (
    <div className={styles.ingredients}>
      {recipe.itemIngredients.map((ingredient) => (
        <Fragment key={ingredient.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <ItemLink item={ingredient.Item} icon={16}/>
        </Fragment>
      ))}
    </div>
  );
};
