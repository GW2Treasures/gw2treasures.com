'use client';

import { Button } from '@gw2treasures/ui/components/Form/Button';
import { useState, type FC, type ReactNode } from 'react';
import { AchievementProgressShareDialog } from './progress-dialog';

export interface AchievementProgressShareButtonProps {
  children?: ReactNode,
  achievementId: number,
}

export const AchievementProgressShareButton: FC<AchievementProgressShareButtonProps> = ({ children, achievementId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button icon="external" onClick={() => setOpen(!open)}>{children}</Button>
      <AchievementProgressShareDialog achievementId={achievementId} open={open} onClose={() => setOpen(false)}/>
    </>
  );
};
