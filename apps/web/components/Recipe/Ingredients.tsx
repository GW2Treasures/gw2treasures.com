import type { Currency, GuildUpgrade, Item, RecipeIngredient } from '@gw2treasures/database';
import { type FC, Fragment, type ReactNode } from 'react';
import type { With, WithIcon } from '@/lib/with';
import { ItemLink } from '../Item/ItemLink';
import styles from './Ingredients.module.css';
import { CurrencyLink } from '../Currency/CurrencyLink';
import { GuildUpgradeLink } from '../GuildUpgrade/GuildUpgradeLink';
import { Icon } from '@gw2treasures/ui';
import type { LocalizedEntity } from '@/lib/localizedName';
import { UnknownItem } from '../Item/UnknownItem';

export type Ingredient = With<RecipeIngredient, {
  item?: null | WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>,
  currency?: null | WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>,
  guildUpgrade?: null | WithIcon<Pick<GuildUpgrade, 'id' | keyof LocalizedEntity>>
}>;

interface IngredientsProps {
  recipe: {
    ingredientCount?: number | null,
    ingredients: Ingredient[],
  }
}

export const Ingredients: FC<IngredientsProps> = ({ recipe }) => {
  return (
    <div className={styles.ingredients}>
      {recipe.ingredientCount && recipe.ingredientCount > recipe.ingredients.length && (
        <div style={{ gridColumn: '1 / 3', marginBottom: 8 }}>
          <Icon icon="warning"/> This recipe has more unknown ingredients
        </div>
      )}

      {recipe.ingredients.map((ingredient) => (
        <Fragment key={`${ingredient.type}_${ingredient.ingredientId}`}>
          <div className={styles.count}>{ingredient.count}&times;</div>
          {renderIngredient(ingredient)}
        </Fragment>
      ))}

    </div>
  );
};

function renderIngredient(ingredient: Ingredient): ReactNode {
  switch(ingredient.type) {
    case 'Item':
      return ingredient.item ? <ItemLink item={ingredient.item} icon={16}/> : <UnknownItem id={ingredient.ingredientId} icon={16}/>;
    case 'Currency':
      return ingredient.currency ? <CurrencyLink currency={ingredient.currency} icon={16}/> : 'Unknown currency';
    case 'GuildUpgrade':
      return ingredient.guildUpgrade ? <GuildUpgradeLink guildUpgrade={ingredient.guildUpgrade} icon={16}/> : 'Unknown guild upgrade';
  }
}
