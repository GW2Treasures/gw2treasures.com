'use client';

import type { FC } from 'react';
import { Ingredients } from './Ingredients';
import { OutputCountRange } from '../Item/OutputCountRange';
import type { MysticForgeIngredientItem, MysticForgeRecipe, Rarity } from '@gw2treasures/database';
import type { LocalizedEntity } from '@/lib/localizedName';
import { ItemLink } from '../Item/ItemLink';

export interface MysticForgeRecipeIngredientsColumnProps {
  mysticForgeRecipe: {
    itemIngredients: (MysticForgeIngredientItem & { Item: LocalizedEntity & { id: number, rarity: Rarity }})[]
  }
}

export const MysticForgeRecipeIngredientsColumn: FC<MysticForgeRecipeIngredientsColumnProps> = ({ mysticForgeRecipe }) => {
  return <Ingredients recipe={mysticForgeRecipe}/>;
};

export interface MysticForgeRecipeOutputColumnProps {
  mysticForgeRecipe: Pick<MysticForgeRecipe, 'outputCountMin' | 'outputCountMax'> & { outputItem: LocalizedEntity & { id: number, rarity: Rarity }}
}

export const MysticForgeRecipeOutputColumn: FC<MysticForgeRecipeOutputColumnProps> = ({ mysticForgeRecipe }) => {
  return <OutputCountRange min={mysticForgeRecipe.outputCountMin} max={mysticForgeRecipe.outputCountMax}>{mysticForgeRecipe.outputItem ? <ItemLink item={mysticForgeRecipe.outputItem}/> : 'Unknown item'}</OutputCountRange>;
};
