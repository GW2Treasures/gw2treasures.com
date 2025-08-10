import { ItemList } from '@/components/ItemList/ItemList';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function SkillsLoading() {
  return (
    <>
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
    </>
  );
}
