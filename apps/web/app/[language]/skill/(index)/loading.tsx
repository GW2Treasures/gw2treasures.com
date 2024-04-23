import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { SkeletonLink } from '@/components/Link/SkeletonLink';

export default function SkillsLoading() {
  return (
    <HeroLayout hero={<Headline id="skills">Skills</Headline>}>
      <Headline id="recent">Recently added</Headline>
      <ItemList>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
      </ItemList>
      <Headline id="updated">Recently updated</Headline>
      <ItemList>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
      </ItemList>
    </HeroLayout>
  );
}
