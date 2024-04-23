import type { FC } from 'react';
import { linkProperties } from '@/lib/linkProperties';
import { ItemTable } from '../ItemTable/ItemTable';
import { extraColumn } from '../ItemTable/columns';
import type { TODO } from '@/lib/todo';
import { MysticForgeRecipeIngredientsColumn, MysticForgeRecipeOutputColumn } from './MysticForgeRecipeTable.client';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemTableContext } from '../ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '../ItemTable/ItemTableColumnsButton';

export interface MysticForgeRecipeTableProps {
  ingredientItemId: number;
}

export const MysticForgeRecipeTable: FC<MysticForgeRecipeTableProps> = ({ ingredientItemId }) => {
  // const mfRecipes = await db.mysticForgeRecipe.findMany({
  //   where: { itemIngredients: { some: { itemId: ingredientItemId }}},
  //   include: {
  //     outputItem: { select: linkProperties },
  //     itemIngredients: { include: { Item: { select: linkProperties }}}
  //   },
  //   orderBy: { outputItem: { views: 'desc' }}
  // });

  // const Recipes = createDataTable(mfRecipes, ({ id }) => id);

  // return (
  //   <Recipes.Table>
  //     <Recipes.Column id="item" title="Output">
  //       {({ outputItem, outputCountMin, outputCountMax }) => <OutputCountRange min={outputCountMin} max={outputCountMax}>{outputItem ? <ItemLink item={outputItem}/> : 'Unknown item'}</OutputCountRange>}
  //     </Recipes.Column>
  //     <Recipes.Column id="ingredients" title="Ingredients">
  //       {(recipe) => <Ingredients recipe={recipe}/>}
  //     </Recipes.Column>
  //   </Recipes.Table>
  // );

  return (
    <ItemTableContext id="mystic-forge-ingredient">
      <Headline id="mystic-forge" actions={<ItemTableColumnsButton/>}>Used in Mystic Forge</Headline>
      <ItemTable
        query={{ model: 'mysticForgeRecipe', mapToItem: 'outputItem', where: { itemIngredients: { some: { itemId: ingredientItemId }}}}}
        extraColumns={[
          extraColumn<'mysticForgeRecipe'>({ id: 'item', select: { outputCountMin: true, outputCountMax: true, outputItem: { select: linkProperties }}, title: 'Output', component: MysticForgeRecipeOutputColumn as TODO, order: 21 }),
          extraColumn<'mysticForgeRecipe'>({ id: 'ingredients', select: { itemIngredients: { include: { Item: { select: linkProperties }}}}, title: 'Ingredients', component: MysticForgeRecipeIngredientsColumn as TODO, order: 210 })
        ]}
        defaultColumns={['item', 'ingredients']}/>
    </ItemTableContext>
  );
};
