import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import Link from 'next/link';
import { HeroLayout } from '@/components/Layout/HeroLayout';

export default function NotFound() {
  return (
    <HeroLayout hero={<Headline id="404">404 - Page not found</Headline>} skipPreload>
      <p>We couldn&apos;t find the page you requested. You can try the search to find the content you were looking for.</p>
      <p>If you think this page should exist, you can <Link href="/about">report it or even contribute yourself</Link>.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: '404 · Page not found'
};
