import { isFestivalActive, type FestivalInfo } from 'app/[language]/festival/festivals';
import type { FC } from 'react';
import { ResetTimer } from './ResetTimer';

export interface FestivalTimerProps {
  festival?: FestivalInfo;
}

export const FestivalTimer: FC<FestivalTimerProps> = ({ festival }) => {
  if(!festival) {
    return null;
  }

  const now = new Date();
  const isActive = isFestivalActive(festival, now);

  if(isActive) {
    return (
      <>Time remaining: <ResetTimer reset={festival.endsAt}/></>
    );
  }

  if(festival.startsAt > now) {
    return (
      <>Starts in: <ResetTimer reset={festival.startsAt}/></>
    );
  }

  return null;
};
