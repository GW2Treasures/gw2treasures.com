import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { getCurrentUrl } from '@/lib/url';
import { getLanguage } from '@/lib/translate';
import Link from 'next/link';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

export default function NotFound() {
  const url = getCurrentUrl();
  const language = getLanguage();

  url.host = `${language}.legacy.gw2treasures.com`;

  return (
    <HeroLayout color="#b7000d" hero={<Headline id="404">404 - Page not found</Headline>}>
      <Notice>Not all pages have been migrated to the new version of gw2treasures.com yet, you can also check if this page exists in the <a href={url.toString()}>legacy version</a>.</Notice>
      <p>We couldn&apos;t find the page you requested. You can try the search to find the content you were looking for.</p>
      <p>If you think this page should exist, you can <Link href="/about">report it or even contribute yourself</Link>.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: '404 · Page not found'
};
