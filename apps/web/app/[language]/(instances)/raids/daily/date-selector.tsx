'use client';

import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition, type FC } from 'react';
import { formatDate } from '../../fractals/helper';
import { getCanonicalUrl } from './helper';
import { useHydrated } from '@/lib/useHydrated';

export interface DateSelectorProps {
  date: Date,
}

export const DateSelector: FC<DateSelectorProps> = ({ date }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const isHydrated = useHydrated();

  const handleChange = useCallback((value: string) => {
    if(!value) {
      return;
    }

    const url = getCanonicalUrl(formatDate(new Date(value)));
    startTransition(() => router.replace(url));
  }, [router]);

  return (
    <TextInput type="date" defaultValue={formatDate(date)} onChange={handleChange} readOnly={!isHydrated || isPending}/>
  );
};
