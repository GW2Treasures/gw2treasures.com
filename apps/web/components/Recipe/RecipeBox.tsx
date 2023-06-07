import { LocalizedEntity } from '@/lib/localizedName';
import { IngredientItem, Item, Recipe, Revision } from '@gw2treasures/database';
import { FC } from 'react';
import { Icon } from '@gw2treasures/ui';
import { With, WithIcon } from '../../lib/with';
import { DropDown } from '../DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { ItemLink } from '../Item/ItemLink';
import { MenuList } from '../MenuList/MenuList';
import { Discipline, DisciplineIcon } from './DisciplineIcon';
import { Ingredients } from './Ingredients';
import styles from './RecipeBox.module.css';
import { encode } from 'gw2e-chat-codes';
import { ShowMore } from '../ShowMore/ShowMore';
import { ResetTimer } from 'app/[language]/achievement/(index)/reset-timer';
import { Tip } from '../Tip/Tip';
import { OutputCount } from '../Item/OutputCount';

interface RecipeBoxProps {
  recipe: Recipe & {
    currentRevision: Revision,
    itemIngredients: With<IngredientItem, { Item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>> }>[]
    unlockedByItems?: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>[]
  },
  outputItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>> | null,
};

export const RecipeBox: FC<RecipeBoxProps> = ({ recipe, outputItem }) => {
  return (
    <div className={styles.box} data-recipe-id={recipe.id}>
      <div className={styles.title}>
        <OutputCount count={recipe.outputCount}>
          {outputItem !== null ? <ItemLink item={outputItem}/> : <span>Unknown Item</span>}
        </OutputCount>
        <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
          <MenuList>
            <CopyButton appearance="menu" icon="chatlink" copy={encode('recipe', recipe.id) || ''}>Copy chatlink</CopyButton>
            <LinkButton appearance="menu" icon="external" href={`https://gw2efficiency.com/crafting/calculator/a~0!b~1!c~0!d~1-${recipe.outputItemId}`} target="_blank" rel="noreferrer noopener">gw2efficiency</LinkButton>
            <LinkButton appearance="menu" icon="external" href={`https://api.guildwars2.com/v2/recipes/${recipe.id}?v=latest`} target="_blank" rel="noreferrer noopener">API</LinkButton>
          </MenuList>
        </DropDown>
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
      {recipe.type === 'RefinementEctoplasm' && (
        <Tip tip={<ResetTimer/>}>
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
