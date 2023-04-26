import { Children, FC, ReactNode } from 'react';
import styles from './Steps.module.css';
import { ReactElement } from 'react';

export interface StepsProps {
  children: ReactNode[]
}

export const Steps: FC<StepsProps> = ({ children }) => {
  return (
    <ol className={styles.steps}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ol>
  );
};
