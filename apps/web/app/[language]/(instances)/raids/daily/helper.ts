import { getDateOrFallback } from '../../fractals/helper';

export function getCanonicalUrl(date?: string): string {
  const parsedDate = getDateOrFallback(date);

  return parsedDate !== getDateOrFallback(undefined)
    ? `/raids/daily?date=${parsedDate}`
    : '/raids/daily';
}

const dayInMs = 24 * 60 * 60 * 1000;

/** Returns the dates (UTC) of the week (Monday to Sunday) containing `date` and the following week. */
export function getCurrentAndNextWeek(date: Date): { date: Date, isNextWeek: boolean }[] {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  const monday = date.valueOf() - daysSinceMonday * dayInMs;

  return Array.from({ length: 14 }, (_, index) => ({
    date: new Date(monday + index * dayInMs),
    isNextWeek: index >= 7,
  }));
}
