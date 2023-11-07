import { type FC, type ReactNode } from 'react';
import styles from './RecipeBox.module.css';

export interface RecipeBoxWrapperProps {
  children: ReactNode;
}

export const RecipeBoxWrapper: FC<RecipeBoxWrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
