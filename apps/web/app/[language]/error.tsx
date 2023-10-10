'use client';

import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';

export default function Error({ error, reset }: { error: Error; reset: () => void; }) {
  return (
    <HeroLayout color="#b7000d" hero={<Headline id="error">Something went wrong!</Headline>}>
      <Button onClick={reset}>Try again</Button>

      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {error.stack && (process.env.NODE_ENV === 'production' ? window.btoa(error.stack) : error.stack)}
      </pre>

    </HeroLayout>
  );
}
