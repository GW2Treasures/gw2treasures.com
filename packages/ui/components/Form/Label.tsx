import { FC, ReactNode } from 'react';
import styles from './Label.module.css';

export interface LabelProps {
  label: ReactNode;
  children: ReactNode;
  visualOnly?: boolean;
}

export const Label: FC<LabelProps> = ({ label, children, visualOnly }) => {
  const Tag = visualOnly ? 'div' : 'label';

  return (
    <Tag className={styles.label}>
      <div>{label}</div>
      <div className={styles.content}>{children}</div>
    </Tag>
  );
};
