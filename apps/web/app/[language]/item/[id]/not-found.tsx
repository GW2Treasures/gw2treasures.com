import { Headline } from '@/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';

export default function ItemNotFound(params: any) {
  return (
    <HeroLayout hero={<Headline id="test">Item not found</Headline>}>
      <p>We couldn&apos;t find the item. The item might not have been added to the API yet.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Item not found'
};
