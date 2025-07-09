import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { BuildTable } from './BuildTable';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';

const getBuilds = cache(async (language: Language) => {
  const builds = await db.build.findMany({
    orderBy: { id: 'desc' },
    where: { id: { not: 0 }}
  });

  const updates = await db.revision.groupBy({
    by: ['buildId', 'entity'],
    where: { type: 'Update', entity: { in: ['Item', 'Skill'] }, language, buildId: { in: builds.map((build) => build.id) }},
    _count: { _all: true },
  });

  return { builds, updates };
}, ['builds'], { revalidate: 600 });

export default async function BuildPage({ params }: PageProps) {
  const { language } = await params;
  const { builds, updates } = await getBuilds(language);

  const buildsWithUpdates = builds.map((build) => ({
    build,
    updates: updates.filter(({ buildId }) => buildId === build.id)
  }));

  return (
    <BuildTable rows={buildsWithUpdates}/>
  );
}

export const generateMetadata = createMetadata({
  title: 'Builds'
});
