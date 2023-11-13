import type { IngredientCurrency, IngredientItem } from '@gw2treasures/database';
import { type FC, Fragment } from 'react';
import type { With } from '@/lib/with';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import styles from './Ingredients.module.css';
import { CurrencyLink, type CurrencyLinkProps } from '../Currency/CurrencyLink';

interface IngredientsProps {
  recipe: {
    itemIngredients: With<Pick<IngredientItem, 'count'>, { Item: ItemLinkProps['item'] }>[],
    currencyIngredients: With<Pick<IngredientCurrency, 'count'>, { Currency: CurrencyLinkProps['currency'] }>[]
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
      {recipe.currencyIngredients.map((ingredient) => (
        <Fragment key={ingredient.Currency.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <CurrencyLink currency={ingredient.Currency} icon={16}/>
        </Fragment>
      ))}
    </div>
  );
};
