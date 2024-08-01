import type { FC } from 'react';
import styles from './CommonComponentTest.module.css';

export const CommonComponentTest: FC = () => {
  return (
    <div className={styles.test}>
      This is a component from @gw2treasures/ui.
    </div>
  );
};
