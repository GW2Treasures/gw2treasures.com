'use client';

import { use, type FC } from 'react';
import { createContextState } from '@/lib/context';
import { Radiobutton } from '@gw2treasures/ui/components/Form/Radiobutton';

export enum AchievementProgressType {
  Objectives,
  Points
}

const {
  Provider: AchievementProgressTypeProvider,
  useValue: useAchievementProgressType,
  context
} = createContextState(AchievementProgressType.Objectives, 'achievements.progress-type');

export {
  AchievementProgressTypeProvider,
  useAchievementProgressType
};


export const AchievementProgressToggle: FC = () => {
  const [type, setType] = use(context);

  return (
    <>
      <Radiobutton checked={type === AchievementProgressType.Objectives} onChange={() => setType(AchievementProgressType.Objectives)}>
        Objective Progress
      </Radiobutton>
      <Radiobutton checked={type === AchievementProgressType.Points} onChange={() => setType(AchievementProgressType.Points)}>
        AP Progress
      </Radiobutton>
    </>
  );
};
