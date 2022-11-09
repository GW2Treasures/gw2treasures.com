import { Icon, IngredientItem, Item, Recipe, Revision } from '@prisma/client';
import { FC } from 'react';
import { useJsonFetch } from '../../lib/useFetch';
import { RecipeTable } from '../Recipe/RecipeTable';
import { SkeletonTable } from '../Skeleton/SkeletonTable';

interface ItemIngredientForProps {
  itemId: number;
  placeholderCount?: number;
};

type IngredientRecipe = Recipe & {
  outputItem: (Item & {
      icon: Icon | null;
  }) | null;
  currentRevision: Revision;
  itemIngredients: (IngredientItem & {
    Item: Item & { icon: Icon | null; };
  })[];
};

export const ItemIngredientFor: FC<ItemIngredientForProps> = ({ itemId, placeholderCount }) => {
  const recipes = useJsonFetch<IngredientRecipe[]>(`/api/item/${itemId}/ingredient`);

  if(recipes.loading) {
    return <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={placeholderCount}/>;
  }

  return (
    <RecipeTable recipes={recipes.data}/>
  );
};
