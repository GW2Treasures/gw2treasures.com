import { db } from '@/lib/prisma';
import { BuildTable } from './BuildTable';

export const dynamic = 'force-dynamic';

async function getBuilds() {
  const language = 'en'; // TODO

  const builds = await db.build.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { revisions: { where: { type: 'Update', language }}}}},
    where: { id: { not: 0 }}
  });

  const updates = await db.revision.groupBy({
    by: ['buildId', 'entity'],
    where: { type: 'Update', language, buildId: { in: builds.map((build) => build.id) }},
    _count: { _all: true },
  });

  return { builds, updates };
}

async function BuildPage() {
  const { builds, updates } = await getBuilds();

  const buildsWithUpdates = builds.map((build) => ({
    build,
    updates: updates.filter(({ buildId }) => buildId === build.id)
  }));

  return (
    <BuildTable rows={buildsWithUpdates} data-superjson/>
  );
};

export default BuildPage;
