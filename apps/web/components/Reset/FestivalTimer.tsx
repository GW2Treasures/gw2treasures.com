import { isFestivalActive, type FestivalInfo } from 'app/[language]/festival/festivals';
import type { FC } from 'react';
import { ResetTimer } from './ResetTimer';
import type { BonusEventInfo } from 'app/[language]/bonus-event/bonus-events';

export interface FestivalTimerProps {
  festival?: FestivalInfo | BonusEventInfo;
}

export const FestivalTimer: FC<FestivalTimerProps> = ({ festival }) => {
  if(!festival) {
    return null;
  }

  const now = new Date();
  const isActive = isFestivalActive(festival, now);

  if(isActive) {
    return (
      <span>Time remaining: <ResetTimer reset={festival.endsAt}/></span>
    );
  }

  if(festival.startsAt > now) {
    return (
      <span>Starts in: <ResetTimer reset={festival.startsAt}/></span>
    );
  }

  return null;
};
