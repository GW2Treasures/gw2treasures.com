import { FC } from 'react';
import styles from './AchievementPoints.module.css';
import { Icon } from '@gw2treasures/ui';

export interface AchievementPointsProps {
  points: number;
}

export const AchievementPoints: FC<AchievementPointsProps> = ({ points }) => {
  return <span className={styles.points}>{points} <Icon icon="achievement_points"/></span>;
};
