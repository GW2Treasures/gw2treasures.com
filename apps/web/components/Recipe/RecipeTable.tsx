import type { IngredientCurrency, IngredientGuildUpgrade, IngredientItem, Recipe, Revision } from '@gw2treasures/database';
import { type FC } from 'react';
import { localizedName } from '@/lib/localizedName';
import type { With } from '@/lib/with';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemLink, type ItemLinkProps } from '../Item/ItemLink';
import { ShowMore } from '../ShowMore/ShowMore';
import { type Discipline, DisciplineIcon } from './DisciplineIcon';
import { Ingredients } from './Ingredients';
import recipeBoxStyles from './RecipeBox.module.css';
import styles from './RecipeTable.module.css';
import { OutputCount } from '../Item/OutputCount';
import type { CurrencyLinkProps } from '../Currency/CurrencyLink';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { RecipeRowFilter, RecipeTableDisciplineFilter, RecipeTableProvider, RecipeTableSearch } from './RecipeTable.client';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { getLanguage } from '@/lib/translate';
import { ColumnSelect } from '../Table/ColumnSelect';
import type { GuildUpgradeLinkProps } from '../GuildUpgrade/GuildUpgradeLink';
import { RecipeDropdown } from './RecipeDropdown';

export interface RecipeTableProps {
  recipes: With<Pick<Recipe, 'id' | 'rating' | 'disciplines' | 'outputCount' | 'outputItemId'>, {
    currentRevision: Pick<Revision, 'data'>,
    itemIngredients: With<Pick<IngredientItem, 'count'>, { Item: ItemLinkProps['item'] }>[]
    currencyIngredients: With<Pick<IngredientCurrency, 'count'>, { Currency: CurrencyLinkProps['currency'] }>[]
    guildUpgradeIngredients: With<Pick<IngredientGuildUpgrade, 'count'>, { GuildUpgrade: GuildUpgradeLinkProps['guildUpgrade'] }>[]
    outputItem: ItemLinkProps['item'] | null;
    unlockedByItems: ItemLinkProps['item'][]
  }>[]
}

export const RecipeTable: FC<RecipeTableProps> = ({ recipes }) => {
  const language = getLanguage();

  const Recipes = createDataTable(recipes, (recipe) => recipe.id);

  const recipeIndexByDiscipline = recipes.reduce<Partial<Record<Discipline, number[]>>>((record, recipe, index) => {
    const update = Object.fromEntries(
      recipe.disciplines.map((discipline) => [discipline, [...record[discipline as Discipline] ?? [], index]])
    );

    return { ...record, ...update };
  }, {});

  const recipeNamesSearchIndex = recipes.reduce<Record<string, number[]>>((record, recipe, index) => {
    const strings = [];

    if(recipe.outputItem) {
      strings.push(localizedName(recipe.outputItem, language));
    }

    for(const ingredient of recipe.itemIngredients) {
      strings.push(localizedName(ingredient.Item, language));
    }
    for(const ingredient of recipe.currencyIngredients) {
      strings.push(localizedName(ingredient.Currency, language));
    }
    for(const unlock of recipe.unlockedByItems) {
      strings.push(localizedName(unlock, language));
    }

    return {
      ...record,
      ...Object.fromEntries(strings.map((string) => [string, [...record[string] ?? [], index]]))
    };
  }, {});

  return (
    <RecipeTableProvider recipeIndexByDiscipline={recipeIndexByDiscipline} recipeNamesSearchIndex={recipeNamesSearchIndex}>
      <Headline id="crafting" actions={(
        <FlexRow wrap>
          <RecipeTableSearch/>
          <RecipeTableDisciplineFilter totalCount={recipes.length}/>
          <ColumnSelect table={Recipes}/>
        </FlexRow>
      )}
      >
        Used in Crafting
      </Headline>

      <div style={{ '--ingredient-count-min-width': '3ch' }}>
        <Recipes.Table rowFilter={RecipeRowFilter}>
          <Recipes.Column id="id" title="ID" align="right" small sortBy="id" hidden>{({ id }) => id}</Recipes.Column>
          <Recipes.Column id="outputId" title="Item ID" align="right" small sortBy="outputItemId" hidden>{({ outputItemId }) => outputItemId}</Recipes.Column>
          <Recipes.Column id="output" title="Output">
            {(recipe) => (
              <div className={styles.outputColumn}>
                <OutputCount count={recipe.outputCount}>
                  {recipe.outputItem ? (<ItemLink item={recipe.outputItem}/>) : 'Unknown'}
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
            {({ disciplines }) => <span className={recipeBoxStyles.disciplines}>{disciplines.map((discipline) => <DisciplineIcon discipline={discipline as Discipline} key={discipline}/>)}</span>}
          </Recipes.Column>
          <Recipes.Column id="ingredients" title="Ingredients">{(recipe) => <Ingredients recipe={recipe}/>}</Recipes.Column>
          <Recipes.Column id="actions" title="" small fixed>
            {({ id, outputItemId }) => (<RecipeDropdown id={id} outputItemId={outputItemId}/>)}
          </Recipes.Column>
        </Recipes.Table>
      </div>
    </RecipeTableProvider>
  );
};
