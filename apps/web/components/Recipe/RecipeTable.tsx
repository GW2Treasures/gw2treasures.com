import type { Recipe } from '@gw2treasures/database';
import { type FC } from 'react';
import { localizedName } from '@/lib/localizedName';
import type { With } from '@/lib/with';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import { ShowMore } from '../ShowMore/ShowMore';
import { DisciplineIcon } from './DisciplineIcon';
import { Ingredients, type Ingredient } from './Ingredients';
import recipeBoxStyles from './RecipeBox.module.css';
import styles from './RecipeTable.module.css';
import { OutputCount } from '../Item/OutputCount';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { getLanguage } from '@/lib/translate';
import { ColumnSelect } from '../Table/ColumnSelect';
import { RecipeDropdown } from './RecipeDropdown';
import { UnknownItem } from '../Item/UnknownItem';
import type { CraftingDiscipline } from '@gw2api/types/data/recipe';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableFilterRow, TableSearchInput, type TableFilterDefinition } from '../Table/TableFilter';
import { isTruthy } from '@gw2treasures/helper/is';

const allDisciplines: CraftingDiscipline[] = [ 'Armorsmith', 'Artificer', 'Chef', 'Homesteader', 'Huntsman', 'Jeweler', 'Leatherworker', 'Scribe', 'Tailor', 'Weaponsmith' ];

export interface RecipeTableProps {
  recipes: With<Pick<Recipe, 'id' | 'rating' | 'disciplines' | 'outputCount' | 'outputItemId' | 'outputItemIdRaw'>, {
    ingredients: Ingredient[];
    outputItem: ItemLinkProps['item'] | null;
    unlockedByItems: ItemLinkProps['item'][];
  }>[]
}

export const RecipeTable: FC<RecipeTableProps> = async ({ recipes }) => {
  const language = await getLanguage();

  const Recipes = createDataTable(recipes, (recipe) => recipe.id);

  const filter: TableFilterDefinition[] = allDisciplines.map((discipline) => ({
    id: discipline,
    name: <><DisciplineIcon discipline={discipline}/> {discipline}</>, // TODO: translate
    rowIndexes: recipes.map((recipe, i) => [recipe, i] as const)
      .filter(([stat]) => stat.disciplines.includes(discipline))
      .map(([, index]) => index)
  }));

  const searchIndex = createSearchIndex(recipes, (recipe) => [
    recipe.outputItem && localizedName(recipe.outputItem, language),
    ...recipe.ingredients.flatMap((ingredient) => [
      ingredient.item && localizedName(ingredient.item, language),
      ingredient.currency && localizedName(ingredient.currency, language),
      ingredient.guildUpgrade && localizedName(ingredient.guildUpgrade, language)
    ]),
    ...recipe.unlockedByItems.map((unlock) => localizedName(unlock, language))
  ].filter(isTruthy));

  return (
    <TableFilterProvider filter={filter} searchIndex={searchIndex}>
      <Headline id="crafting" actions={(
        <FlexRow wrap>
          <TableSearchInput/>
          <TableFilterButton totalCount={recipes.length}/>
          <ColumnSelect table={Recipes}/>
        </FlexRow>
      )}
      >
        Used in Crafting
      </Headline>

      <div style={{ '--ingredient-count-min-width': '3ch' }}>
        <Recipes.Table rowFilter={TableFilterRow} collapsed={10}>
          <Recipes.Column id="id" title="ID" align="right" small sortBy="id" hidden>{({ id }) => id}</Recipes.Column>
          <Recipes.Column id="outputId" title="Item ID" align="right" small sortBy="outputItemIdRaw" hidden>{({ outputItemIdRaw }) => outputItemIdRaw}</Recipes.Column>
          <Recipes.Column id="output" title="Output">
            {(recipe) => (
              <div className={styles.outputColumn}>
                <OutputCount count={recipe.outputCount}>
                  {recipe.outputItem ? (<ItemLink item={recipe.outputItem}/>) : recipe.outputItemIdRaw ? <UnknownItem id={recipe.outputItemIdRaw}/> : 'Unknown'}
                </OutputCount>
                {!!recipe.unlockedByItems?.length && (
                  <div className={styles.unlock}>
                    <ShowMore>
                      {recipe.unlockedByItems.map((unlock) => (<ItemLink key={unlock.id} item={unlock} icon={16}/>))}
                    </ShowMore>
                  </div>
                )}
              </div>
            )}
          </Recipes.Column>
          <Recipes.Column id="rating" title="Rating" align="right" sortBy="rating">{({ rating }) => rating}</Recipes.Column>
          <Recipes.Column id="disciplines" title="Disciplines">
            {({ disciplines }) => <span className={recipeBoxStyles.disciplines}>{disciplines.map((discipline) => <DisciplineIcon discipline={discipline as CraftingDiscipline} key={discipline}/>)}</span>}
          </Recipes.Column>
          <Recipes.Column id="ingredients" title="Ingredients">{(recipe) => <Ingredients recipe={recipe}/>}</Recipes.Column>
          <Recipes.Column id="actions" title="" small fixed>
            {({ id, outputItemId }) => (<RecipeDropdown id={id} outputItemId={outputItemId}/>)}
          </Recipes.Column>
        </Recipes.Table>
      </div>
    </TableFilterProvider>
  );
};
