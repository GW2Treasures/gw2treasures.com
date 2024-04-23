import type { FC } from 'react';
import styles from './Separator.module.css';

interface SeparatorProps {
  // TODO: define props
};

export const Separator: FC<SeparatorProps> = ({ }) => {
  return (
    <hr className={styles.separator}/>
  );
};
