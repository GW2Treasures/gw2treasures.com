import type { LocalizedEntity } from '@/lib/localizedName';
import type { Item, Recipe } from '@gw2treasures/database';
import type { FC } from 'react';
import { Icon } from '@gw2treasures/ui';
import type { WithIcon } from '@/lib/with';
import { ItemLink } from '../Item/ItemLink';
import { DisciplineIcon } from './DisciplineIcon';
import { Ingredients, type Ingredient } from './Ingredients';
import styles from './RecipeBox.module.css';
import { ShowMore } from '../ShowMore/ShowMore';
import { ResetTimer } from '../Reset/ResetTimer';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { OutputCount } from '../Item/OutputCount';
import { RecipeDropdown } from './RecipeDropdown';
import { UnknownItem } from '../Item/UnknownItem';
import type { CraftingDiscipline } from '@gw2api/types/data/recipe';
import { allDisciplines } from './disciplines';

interface RecipeBoxProps {
  recipe: Recipe & {
    ingredients: Ingredient[],
    unlockedByItems?: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>[]
  },
  outputItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>> | null,
}

export const RecipeBox: FC<RecipeBoxProps> = ({ recipe, outputItem }) => {
  return (
    <div className={styles.box} data-recipe-id={recipe.id}>
      <div className={styles.title}>
        <OutputCount count={recipe.outputCount}>
          {outputItem !== null ? <ItemLink item={outputItem}/> : <UnknownItem id={recipe.outputItemIdRaw ?? 0}/>}
        </OutputCount>
        <RecipeDropdown id={recipe.id} outputItemId={recipe.outputItemId}/>
      </div>
      <div className={styles.info}>
        <span className={styles.disciplines}>
          {allDisciplines.map((discipline) => recipe.disciplines.includes(discipline) && <DisciplineIcon key={discipline} discipline={discipline as CraftingDiscipline}/>)}
        </span>
        <span className={styles.rating}>
          {recipe.rating}
        </span>
        <span className={styles.time}>
          {recipe.timeToCraftMs / 1000}s
        </span>
        <Icon icon="time"/>
      </div>
      {recipe.type === 'RefinementEctoplasm' && (
        <Tip tip={<span>Reset: <ResetTimer/></span>}>
          <div className={styles.info}>
            <Icon icon="revision"/> Can only be crafted once per day.
          </div>
        </Tip>
      )}
      <div className={styles.ingredients}>
        <Ingredients recipe={recipe}/>
      </div>
      <div className={styles.unlocks}>
        {recipe.flags.includes('AutoLearned')
          ? <span><Icon icon="unlock"/> Learned automatically</span>
          : recipe.flags.includes('LearnedFromItem')
            ? (recipe.unlockedByItems?.length
                ? <ShowMore>{recipe.unlockedByItems.map((unlock) => <ItemLink key={unlock.id} item={unlock} icon={16}/>)}</ShowMore>
                : <span><Icon icon="unlock"/> Learned from unknown item</span>)
            : <span><Icon icon="unlock"/> Discoverable</span>}
      </div>
    </div>
  );
};
