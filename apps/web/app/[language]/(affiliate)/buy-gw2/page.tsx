import { createMetadata } from '@/lib/metadata';
import { Redirect } from '../redirect';
import { affiliateBuyGw2Url } from '@/lib/affiliate';
import ogImage from './buy-gw2.png';

export default function BuyGw2Page() {
  return <Redirect href={affiliateBuyGw2Url}/>;
}

export const generateMetadata = createMetadata({
  title: { absolute: 'Buy Guild Wars 2 and support gw2treasures.com' },
  robots: 'noindex',
  description: 'Support gw2treasures.com by buying Guild Wars 2 using our official affiliate link.',
  image: ogImage,
  url: '/buy-gw2',
});
