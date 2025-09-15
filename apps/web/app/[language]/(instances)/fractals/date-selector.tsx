'use client';

import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition, type FC } from 'react';
import { formatDate, getCanonicalUrl, type TierFilter } from './helper';
import { useHydrated } from '@/lib/useHydrated';

export interface DateSelectorProps {
  tier: TierFilter,
  date: Date,
}

export const DateSelector: FC<DateSelectorProps> = ({ tier, date }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const isHydrated = useHydrated();

  const handleChange = useCallback((value: string) => {
    if(!value) {
      return;
    }

    const url = getCanonicalUrl(tier, formatDate(new Date(value)));
    startTransition(() => router.replace(url));
  }, [router, tier]);

  return (
    <TextInput type="date" defaultValue={formatDate(date)} onChange={handleChange} readOnly={!isHydrated || isPending}/>
  );
};
