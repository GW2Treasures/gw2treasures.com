import type { IngredientCurrency, IngredientGuildUpgrade, IngredientItem } from '@gw2treasures/database';
import { type FC, Fragment } from 'react';
import type { With } from '@/lib/with';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import styles from './Ingredients.module.css';
import { CurrencyLink, type CurrencyLinkProps } from '../Currency/CurrencyLink';
import { GuildUpgradeLink, type GuildUpgradeLinkProps } from '../GuildUpgrade/GuildUpgradeLink';
import { Icon } from '@gw2treasures/ui';

interface IngredientsProps {
  recipe: {
    ingredientCount?: number | null,
    itemIngredients: With<Pick<IngredientItem, 'count'>, { Item: ItemLinkProps['item'] }>[],
    currencyIngredients?: With<Pick<IngredientCurrency, 'count'>, { Currency: CurrencyLinkProps['currency'] }>[]
    guildUpgradeIngredients?: With<Pick<IngredientGuildUpgrade, 'count'>, { GuildUpgrade: GuildUpgradeLinkProps['guildUpgrade'] }>[]
  }
}

export const Ingredients: FC<IngredientsProps> = ({ recipe }) => {
  return (
    <div className={styles.ingredients}>
      {recipe.ingredientCount && recipe.ingredientCount > recipe.itemIngredients.length + (recipe.currencyIngredients?.length ?? 0) + (recipe.guildUpgradeIngredients?.length ?? 0) && (
        <div style={{ gridColumn: '1 / 3', marginBottom: 8 }}>
          <Icon icon="warning"/> This recipe has more unknown ingredients
        </div>
      )}
      {recipe.itemIngredients.map((ingredient) => (
        <Fragment key={ingredient.Item.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <ItemLink item={ingredient.Item} icon={16}/>
        </Fragment>
      ))}
      {recipe.currencyIngredients?.map((ingredient) => (
        <Fragment key={ingredient.Currency.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <CurrencyLink currency={ingredient.Currency} icon={16}/>
        </Fragment>
      ))}
      {recipe.guildUpgradeIngredients?.map((ingredient) => (
        <Fragment key={ingredient.GuildUpgrade.id}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          <GuildUpgradeLink guildUpgrade={ingredient.GuildUpgrade} icon={16}/>
        </Fragment>
      ))}
    </div>
  );
};
