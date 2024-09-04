import instabilityData from './instabilities/data.json';

export function getDayOfYearIndex(date: Date = new Date()) {
  const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfYearUTC = Date.UTC(date.getFullYear(), 0, 1);

  const index = (dateUTC - startOfYearUTC) / 24 / 60 / 60 / 1000;

  const isLeapYear = new Date(date.getUTCFullYear(), 1, 29).getDate() === 29;

  return !isLeapYear && index >= 59
    ? index + 1
    : index;
}

export function getInstabilities(level: number, dayOfYearIndex: number) {
  const tier = Math.floor((level - 1) / 25);

  if(tier !== 3) {
    return [];
  }

  // const t4Level = level + (3 - tier) * 25;

  return instabilityData.instabilities[level.toString() as keyof typeof instabilityData.instabilities][dayOfYearIndex].slice(0, tier);
}

export type TierFilter = '4' | '3' | '2' | '1' | 'all';
const validTiers: string[] = ['1', '2', '3', '4', 'all'] satisfies TierFilter[];

export function getTierOrFallback(value: string | undefined): TierFilter {
  return value !== undefined && validTiers.includes(value)
    ? value as TierFilter
    : '4';
}

export function getDateOrFallback(value: string | undefined): string {
  return value !== undefined && value === formatDate(new Date(value))
    ? value
    : formatDate(new Date());
}

export function formatDate(date: Date) {
  if(isNaN(date.valueOf())) {
    return '';
  }

  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
}

export function getCanonicalSearchParams(tier?: TierFilter, date?: string): URLSearchParams {
  const parsedTier = getTierOrFallback(tier);
  const parsedDate = getDateOrFallback(date);

  const canonical = new URLSearchParams();

  if(parsedTier !== getTierOrFallback(undefined)) {
    canonical.set('tier', parsedTier);
  }
  if(parsedDate !== getDateOrFallback(undefined)) {
    canonical.set('date', parsedDate);
  }

  return canonical;
}

export function getCanonicalUrl(tier?: TierFilter, date?: string): string {
  const searchParams = getCanonicalSearchParams(tier, date);

  return searchParams.size > 0
    ? `/fractals?${searchParams.toString()}`
    : '/fractals';
}
