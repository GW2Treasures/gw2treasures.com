import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { remember } from '@/lib/remember';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import DetailLayout from '@/components/Layout/DetailLayout';
import { notFound } from 'next/navigation';
import type { Gw2Api } from 'gw2-api-types';
import { Json } from '@/components/Format/Json';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { GuildUpgradeIngredientFor } from '@/components/GuildUpgrade/GuildUpgradeIngredientFor';

const getGuildUpgrade = remember(60, async function getGuildUpgrade(id: number, language: Language) {
  if(isNaN(id)) {
    notFound();
  }

  const guildUpgrade = await db.guildUpgrade.findUnique({
    where: { id },
    include: {
      icon: true,
      _count: {
        select: { ingredient: true }
      }
    },
  });

  return guildUpgrade;
});

const getRevision = remember(60, async function getRevision(id: number, language: Language, revisionId?: string) {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentGuildUpgrade_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Guild.Upgrade : undefined,
  };
});


export default async function GuildUpgradePage({ params: { id, language }}: { params: { id: string, language: Language }}) {
  const guildUpgradeId = Number(id);
  const [guildUpgrade, { revision, data }] = await Promise.all([
    getGuildUpgrade(guildUpgradeId, language),
    getRevision(guildUpgradeId, language)
  ]);

  if(!guildUpgrade || !revision || !data) {
    notFound();
  }

  return (
    <DetailLayout title={data.name} breadcrumb="Guild Upgrade" icon={guildUpgrade.icon}>
      <p>{data.description}</p>

      {guildUpgrade._count.ingredient > 0 && (
        <Suspense fallback={(
          <>
            <Headline id="crafting">Used in crafting</Headline>
            <SkeletonTable columns={['Output', 'Rating', 'Disciplines', 'Ingredients']} rows={guildUpgrade._count.ingredient}/>
          </>
        )}
        >
          <GuildUpgradeIngredientFor guildUpgradeId={guildUpgrade.id}/>
        </Suspense>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}
