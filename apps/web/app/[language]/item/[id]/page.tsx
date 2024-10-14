import { ItemPageComponent } from './component';
import type { Metadata } from 'next';
import { getRevision } from './data';
import { notFound } from 'next/navigation';
import { getIconUrl } from '@/lib/getIconUrl';
import { parseIcon } from '@/lib/parseIcon';
import { getAlternateUrls } from '@/lib/url';
import type { PageProps } from '@/lib/next';

export type ItemPageProps = PageProps<{ id: string }>;

export default async function ItemPage({ params }: ItemPageProps) {
  const { language, id } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { language, id } = await params;
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
