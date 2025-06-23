export type TierFilter = 'cm' | '4' | '3' | '2' | '1' | 'all';
const validTiers: string[] = ['cm', '1', '2', '3', '4', 'all'] satisfies TierFilter[];

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
