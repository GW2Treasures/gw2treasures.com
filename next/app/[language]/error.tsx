'use client';

import { Button } from '@/components/Form/Button';
import { Headline } from '@/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Separator } from '@/components/Layout/Separator';

export default function Error({ error, reset }: { error: Error; reset: () => void; }) {
  return (
    <HeroLayout color="#b7000d" hero={<Headline id="error">Something went wrong!</Headline>}>
      <Button onClick={reset}>Try again</Button>

      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {error.stack && window.btoa(error.stack)}
      </pre>

    </HeroLayout>
  );
}
