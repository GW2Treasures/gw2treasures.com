import { AchievementPageComponent } from '../component';
import type { Metadata } from 'next';
import { getRevision } from '../data';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/next';
import { strip } from 'gw2-tooltip-html';
import { parseIcon } from '@/lib/parseIcon';
import { getIconUrl } from '@/lib/getIconUrl';
import { getAlternateUrls } from '@/lib/url';

type AchievementRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function AchievementPage({ params }: AchievementRevisionPageProps) {
  const { language, id, revisionId } = await params;
  const achievementId = Number(id);

  return <AchievementPageComponent language={language} achievementId={achievementId} revisionId={revisionId}/>;
}

export async function generateMetadata({ params }: AchievementRevisionPageProps): Promise<Metadata> {
  const { language, id: idParam, revisionId } = await params;
  const achievementId = Number(idParam);

  const { data } = await getRevision(achievementId, language, revisionId);

  if(!data) {
    notFound();
  }

  const description = [
    strip(data.description),
    data.requirement && strip(data.requirement.replace(/( |^)\/?( |$)/g, `$1${data.tiers[data.tiers.length - 1].count}$2`))
  ].filter(Boolean).join('\n\n');

  const icon = parseIcon(data.icon);

  return {
    title: `${data.name} @ ${revisionId}`,
    description,
    openGraph: {
      images: icon ? [{ url: getIconUrl(icon, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/achievement/${achievementId}/${revisionId}`, language),
    robots: { index: false }
  };
}
