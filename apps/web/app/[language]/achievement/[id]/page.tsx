import { AchievementPageComponent } from './component';
import type { Metadata } from 'next';
import { getRevision } from './data';
import { notFound } from 'next/navigation';
import { getIconUrl } from '@/lib/getIconUrl';
import { parseIcon } from '@/lib/parseIcon';
import { getAlternateUrls } from '@/lib/url';
import type { PageProps } from '@/lib/next';
import { strip } from 'gw2-tooltip-html';

export type AchievementPageProps = PageProps<{ id: string }>;

export default async function AchievementPage({ params }: AchievementPageProps) {
  const { language, id } = await params;
  const achievementId = Number(id);

  return <AchievementPageComponent language={language} achievementId={achievementId}/>;
}


export async function generateMetadata({ params }: AchievementPageProps): Promise<Metadata> {
  const { language, id: idParam } = await params;
  const achievementId = Number(idParam);

  const { data } = await getRevision(achievementId, language);

  if(!data) {
    notFound();
  }

  const description = [
    strip(data.description),
    data.requirement && strip(data.requirement.replace(/( |^)\/?( |$)/g, `$1${data.tiers[data.tiers.length - 1].count}$2`))
  ].filter(Boolean).join('\n\n');

  const icon = parseIcon(data.icon);

  return {
    title: data.name,
    description,
    openGraph: {
      images: icon ? [{ url: getIconUrl(icon, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/achievement/${achievementId}`, language),
  };
}
