import type { LocalizedEntity } from '@/lib/localizedName';
import type { Item, MysticForgeIngredientItem, MysticForgeRecipe } from '@gw2treasures/database';
import type { FC } from 'react';
import type { With, WithIcon } from '@/lib/with';
import { ItemLink } from '../Item/ItemLink';
import styles from './RecipeBox.module.css';
import { Ingredients } from './Ingredients';
import { OutputCountRange } from '../Item/OutputCountRange';
import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';

interface MysticForgeRecipeBoxProps {
  recipe: MysticForgeRecipe & {
    itemIngredients: With<MysticForgeIngredientItem, { Item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>> }>[]
  },
  outputItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>,
};

export const MysticForgeRecipeBox: FC<MysticForgeRecipeBoxProps> = ({ recipe, outputItem }) => {
  return (
    <div className={styles.box} data-recipe-id={recipe.id}>
      <div className={styles.title}>
        <OutputCountRange min={recipe.outputCountMin} max={recipe.outputCountMax}>
          {outputItem !== null ? <ItemLink item={outputItem}/> : <span>Unknown Item</span>}
        </OutputCountRange>

        <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right">
          <MenuList>
            <LinkButton appearance="menu" href={`/item/${outputItem.id}/edit-mystic-forge?recipe=${recipe.id}`}>Edit Mystic Forge Recipe</LinkButton>
          </MenuList>
        </DropDown>
      </div>
      <div className={styles.info}>
        <span className={styles.disciplines}>
          <Icon icon="mystic-forge"/> Mystic Forge
        </span>
      </div>
      <div className={styles.ingredients}>
        <Ingredients recipe={recipe}/>
      </div>
    </div>
  );
};
