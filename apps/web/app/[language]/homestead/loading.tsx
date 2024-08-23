import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default function HomesteadLoading() {
  return (
    <HeroLayout color="#397aa1" hero={<Headline id="homestead">Homestead</Headline>}>
      <Skeleton/>
    </HeroLayout>
  );
}
