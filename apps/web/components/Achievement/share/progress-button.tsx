import { Suspense, type FC } from 'react';
import * as client from './progress-button.client';

export interface AchievementProgressShareButtonProps {
  achievementId: number,
}

export const AchievementProgressShareButton: FC<AchievementProgressShareButtonProps> = ({ achievementId }) => {
  return (
    <Suspense>
      <client.AchievementProgressShareButton achievementId={achievementId}>Share your progress</client.AchievementProgressShareButton>
    </Suspense>
  );
};
