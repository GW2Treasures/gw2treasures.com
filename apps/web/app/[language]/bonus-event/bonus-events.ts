export enum BonusEvent {
  EvonGnashbladesBirthday,
  DungeonRush,
  FractalIncursion,
}

export interface BonusEventInfo {
  type: BonusEvent,
  startsAt: Date,
  endsAt: Date,
}

export function getActiveBonusEvent(): BonusEventInfo | undefined {
  const now = new Date();
  const inThreeHours = new Date(now);
  inThreeHours.setHours(inThreeHours.getHours() + 3);

  return bonusEvents.find((bonusEvent) => isBonusEventActive(bonusEvent, now) || isBonusEventActive(bonusEvent, inThreeHours));
}

export function getBonusEvent(type: BonusEvent): BonusEventInfo | undefined {
  return bonusEvents.findLast((bonusEvent) => bonusEvent.type === type);
}

export function isBonusEventActive(bonusEvent: BonusEventInfo | undefined, timestamp?: Date) {
  if(!bonusEvent) {
    return false;
  }

  timestamp ??= new Date();

  return bonusEvent.startsAt <= timestamp && bonusEvent.endsAt > timestamp;
}

export const bonusEvents: BonusEventInfo[] = [
  { type: BonusEvent.EvonGnashbladesBirthday, startsAt: new Date('2024-11-25T17:00:00.000Z'), endsAt: new Date('2024-12-02T17:00:00.000Z') },
  { type: BonusEvent.DungeonRush, startsAt: new Date('2024-04-08T16:00:00.000Z'), endsAt: new Date('2025-04-15T19:00:00.000Z') },
  { type: BonusEvent.FractalIncursion, startsAt: new Date('2025-09-09T16:00:00.000Z'), endsAt: new Date('2025-10-07T19:00:00.000Z') },
  { type: BonusEvent.EvonGnashbladesBirthday, startsAt: new Date('2025-11-24T17:00:00.000Z'), endsAt: new Date('2025-12-02T17:00:00.000Z') },
];
