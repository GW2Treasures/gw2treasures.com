import type { Language } from '@gw2treasures/database';
import { ItemPageComponent } from './component';
import type { Metadata } from 'next';
import { getRevision } from './data';
import { notFound } from 'next/navigation';
import { getIconUrl } from '@/lib/getIconUrl';
import { parseIcon } from '@/lib/parseIcon';
import { getAlternateUrls } from '@/lib/url';

export interface ItemPageProps {
  params: {
    language: Language;
    id: string;
  }
}

export default function ItemPage({ params: { language, id }}: ItemPageProps) {
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
}

export async function generateMetadata({ params: { language, id }}: ItemPageProps): Promise<Metadata> {
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: data.name || id,
    openGraph: {
      images: icon ? [{ url: getIconUrl(icon, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/item/${id}`)
  };
}
