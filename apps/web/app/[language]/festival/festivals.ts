export enum Festival {
  Wintersday,
}

export interface FestivalInfo {
  type: Festival,
  startsAt: Date,
  endsAt: Date,
}

export function getActiveFestival(): FestivalInfo | undefined {
  const now = new Date();
  return festivals.find((festival) => festival.startsAt <= now && festival.endsAt > now);
}

export const festivals: FestivalInfo[] = [
  { type: Festival.Wintersday, startsAt: new Date('2024-01-10T16:00:00.000Z'), endsAt: new Date('2025-01-02T17:00:00.000Z') },
];
