import type { FC, ReactNode } from 'react';
import styles from './Description.module.css';

interface DescriptionProps {
  children: ReactNode,
  actions?: ReactNode,
}

export const Description: FC<DescriptionProps> = ({ children, actions }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.description}>{children}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};
