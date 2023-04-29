import { FC } from 'react';
import styles from './CommonComponentTest.module.css';

export interface CommonComponentTestProps {
  // TODO: add props
}

export const CommonComponentTest: FC<CommonComponentTestProps> = ({ }) => {
  return (
    <div className={styles.test}>
      This is a component from @gw2treasures/ui.
    </div>
  );
};
