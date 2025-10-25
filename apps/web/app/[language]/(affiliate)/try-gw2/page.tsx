import { createMetadata } from '@/lib/metadata';
import { Redirect } from '../redirect';
import { affiliateTryGw2Url } from '@/lib/affiliate';
import ogImage from './try-gw2.png';

export default function TryGw2Page() {
  return <Redirect href={affiliateTryGw2Url}/>;
}

export const generateMetadata = createMetadata({
  title: { absolute: 'Try Guild Wars 2 and support gw2treasures.com' },
  robots: 'noindex',
  description: 'Try out Guild Wars 2 for free and support gw2treasures.com by using our official affiliate link.',
  image: ogImage,
  url: '/try-gw2',
});
