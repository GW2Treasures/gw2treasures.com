import type { FC, ReactNode } from 'react';
import styles from './Label.module.css';

export interface LabelProps {
  label: ReactNode;
  children: ReactNode;
}

export const Label: FC<LabelProps> = ({ label, children }) => {
  return (
    <label className={styles.label}>
      <div>{label}</div>
      <div className={styles.content}>{children}</div>
    </label>
  );
};
