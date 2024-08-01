import type { FC } from 'react';
import styles from './Separator.module.css';

export const Separator: FC = () => {
  return (
    <hr className={styles.separator}/>
  );
};
