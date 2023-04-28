import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ReactNode } from 'react';

export default function BuildLayout({ children }: { children: ReactNode }) {
  return (
    <HeroLayout hero={<Headline id="Builds">Builds</Headline>} color="#3f51b5">
      {children}
    </HeroLayout>
  );
}
