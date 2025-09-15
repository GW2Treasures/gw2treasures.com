import type { FC, ReactNode } from 'react';

export interface DragonBashHeroProps {
  children: ReactNode,
}

export const DragonBashHero: FC<DragonBashHeroProps> = ({ children }) => {
  return children;
};
