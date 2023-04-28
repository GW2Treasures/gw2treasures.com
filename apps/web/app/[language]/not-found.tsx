import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';

export default function NotFound() {
  return (
    <HeroLayout color="#b7000d" hero={<Headline id="404">404 - Page not found</Headline>}>
      We couldn&apos;t find the page you requested. You can try the search to find the content you were looking for.
    </HeroLayout>
  );
}

export const metadata = {
  title: '404'
};
