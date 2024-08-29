'use client';

import type { FC } from 'react';


export const UnlocksRecipeIdColumn: FC<{ item: { unlocksRecipeIds: number[] }, missingIds: number[] }> = ({ item: { unlocksRecipeIds }, missingIds }) => {
  const missing = unlocksRecipeIds.filter((id) => missingIds.includes(id));

  return <a href={`https://api.guildwars2.com/v2/recipes?ids=${missing.join(',')}&v=latest`}>{missing.join(', ')}</a>;
};

export const ItemIdColumn: FC<{ item: { id: number } }> = ({ item: { id } }) => {
  return <a href={`https://api.guildwars2.com/v2/items?ids=${id}&v=latest`}>{id}</a>;
};
