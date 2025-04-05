import { AchievementPageComponent } from './component';
import type { Metadata } from 'next';
import { getRevision } from './data';
import { notFound } from 'next/navigation';
import { getIconUrl } from '@/lib/getIconUrl';
import { parseIcon } from '@/lib/parseIcon';
import { getAlternateUrls } from '@/lib/url';
import type { PageProps } from '@/lib/next';
import { strip } from 'gw2-tooltip-html';
import { db } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { signingKey } from '@/components/ItemTable/signingKey';
import type { AchievementProgressSnapshot } from '@/components/Achievement/share/types';

export type AchievementPageProps = PageProps<{ id: string }>;

export default async function AchievementPage({ params, searchParams }: AchievementPageProps) {
  const { language, id } = await params;
  const achievementId = Number(id);

  const { snapshot } = await searchParams;

  const snapshotData = snapshot && typeof snapshot === 'string'
    ? await tryParseSnapshotJwt(snapshot, achievementId)
    : undefined;

  return <AchievementPageComponent language={language} achievementId={achievementId} snapshots={snapshotData}/>;
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

  // parse icon from revision
  const achievementIcon = parseIcon(data.icon);

  // load category icon if achievement icon doesn't exist
  const categoryIcon = !achievementIcon
    ? (await db.achievementCategory.findFirst({
        where: { achievements: { some: { id: achievementId }}},
        select: { icon: true }
      }))?.icon
    : undefined;

  // fallback to category icon
  const icon = achievementIcon ?? categoryIcon;

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

async function tryParseSnapshotJwt(jwt: string, achievementId: number) {
  try {
    const { payload } = await jwtVerify(jwt, await signingKey.getKey(), { audience: `gw2t:a${achievementId}` });

    return payload.snps as AchievementProgressSnapshot[];
  } catch (e) {
    console.error('Failed to parse snapshot JWT', e);
  }

  return undefined;
}
