import { range } from 'd3-array';
import type { FC } from 'react';
import styles from './difficulty.module.css';

export interface RaidDifficultyProps {
  difficulty: 1 | 2 | 3 | 4 | 5,
}

export const RaidDifficulty: FC<RaidDifficultyProps> = ({ difficulty }) => {
  return (
    <span className={styles.difficulty} aria-label={`${difficulty} / 5`}>
      {range(1, 6).map((d) => (
        <span key={d} className={d <= difficulty ? styles.dd : styles.d}/>
      ))}
    </span>
  );
};
