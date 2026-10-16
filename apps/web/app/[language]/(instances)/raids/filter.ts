type RaidType = 'wing' | 'encounter';

export function getTypeFilter(value: string | undefined): RaidType | undefined {
  return value === 'wing' || value === 'encounter' ? value : undefined;
}

export function getFilterUrl(type?: RaidType): string {
  return type ? `/raids?weekly=${type}` : '/raids';
}
