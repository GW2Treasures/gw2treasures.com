import { Headline } from '@/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default function loadingAchievement() {
  return (
    <HeroLayout hero={<Headline id="achievements">Achievements</Headline>} color="#663399">
      <Headline id=""><Skeleton/></Headline>
      <p><Skeleton/></p>
      <ItemList>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
      </ItemList>
    </HeroLayout>
  );
}
