import type { FC } from 'react';
import styles from './AchievementPoints.module.css';
import { Icon } from '@gw2treasures/ui';
import { FormatNumber } from '../Format/FormatNumber';

export interface AchievementPointsProps {
  points: number,
}

export const AchievementPoints: FC<AchievementPointsProps> = ({ points }) => {
  return <span className={styles.points}><FormatNumber value={points} unit={<Icon icon="achievement_points"/>}/></span>;
};
