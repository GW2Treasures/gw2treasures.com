'use client';

import type { FC } from 'react';


export const UnlocksRecipeIdColumn: FC<{ item: { unlocksRecipeIds: number[] }, missingIds: number[] }> = ({ item: { unlocksRecipeIds }, missingIds }) => {
  const missing = unlocksRecipeIds.filter((id) => missingIds.includes(id));

  return <a href={`https://api.guildwars2.com/v2/recipes?ids=${missing.join(',')}`}>{missing.join(', ')}</a>;
};
