export enum Festival {
  Wintersday,
  LunarNewYear,
}

export interface FestivalInfo {
  type: Festival,
  startsAt: Date,
  endsAt: Date,
}

export function getActiveFestival(): FestivalInfo | undefined {
  const now = new Date();
  return festivals.find((festival) => isFestivalActive(festival, now));
}

export function getFestival(type: Festival): FestivalInfo | undefined {
  return festivals.findLast((festival) => festival.type === type);
}

export function isFestivalActive(festival: FestivalInfo | undefined, timestamp?: Date) {
  if(!festival) {
    return false;
  }

  timestamp ??= new Date();

  return festival.startsAt <= timestamp && festival.endsAt > timestamp;
}

export const festivals: FestivalInfo[] = [
  { type: Festival.Wintersday, startsAt: new Date('2024-12-10T17:00:00.000Z'), endsAt: new Date('2025-01-02T17:00:00.000Z') },
  { type: Festival.LunarNewYear, startsAt: new Date('2025-01-28T17:00:00.000Z'), endsAt: new Date('2025-02-18T17:00:00.000Z') },
];
