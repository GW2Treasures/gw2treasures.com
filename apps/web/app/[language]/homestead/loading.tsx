import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Trans } from '@/components/I18n/Trans';

export default function HomesteadLoading() {
  return (
    <HeroLayout color="#397aa1" hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>}>
      <Skeleton/>
    </HeroLayout>
  );
}
