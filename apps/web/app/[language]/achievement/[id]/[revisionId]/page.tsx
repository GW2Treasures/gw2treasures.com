import { AchievementPageComponent } from '../component';
import { getRevision } from '../data';
import { notFound } from 'next/navigation';
import { strip } from 'gw2-tooltip-html';
import { parseIcon } from '@/lib/parseIcon';
import { getIconUrl } from '@/lib/getIconUrl';
import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';

type AchievementRevisionPageProps = PageProps<'/[language]/achievement/[id]/[revisionId]'>;

export default async function AchievementPage({ params }: AchievementRevisionPageProps) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const achievementId = Number(id);

  return <AchievementPageComponent language={language} achievementId={achievementId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<AchievementRevisionPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id: idParam, revisionId } = await params;
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
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
    url: `/achievement/${achievementId}/${revisionId}`,
    robots: { index: false }
  };
});
