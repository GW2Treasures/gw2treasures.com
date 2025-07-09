import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import DetailLayout from '@/components/Layout/DetailLayout';
import { notFound } from 'next/navigation';
import type { Gw2Api } from 'gw2-api-types';
import { Json } from '@/components/Format/Json';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { GuildUpgradeIngredientFor } from '@/components/GuildUpgrade/GuildUpgradeIngredientFor';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ItemList } from '@/components/ItemList/ItemList';
import { ItemLink } from '@/components/Item/ItemLink';
import { localizedName } from '@/lib/localizedName';
import { RecipeBoxWrapper } from '@/components/Recipe/RecipeBoxWrapper';
import { RecipeBox } from '@/components/Recipe/RecipeBox';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';

const getGuildUpgrade = cache(async (id: number) => {
  if(isNaN(id)) {
    notFound();
  }

  const guildUpgrade = await db.guildUpgrade.findUnique({
    where: { id },
    include: {
      icon: true,
      unlockedByItems: { select: linkProperties },
      recipeOutput: { include: { ingredients: { include: { item: { select: linkProperties }, currency: { select: linkPropertiesWithoutRarity }, guildUpgrade: { select: linkPropertiesWithoutRarity }}}, unlockedByItems: { select: linkProperties }, outputItem: { select: linkProperties }}},
      _count: {
        select: { ingredient: true }
      }
    },
  });

  return guildUpgrade;
}, ['guild-upgrade'], { revalidate: 60 });

const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentGuildUpgrade_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Gw2Api.Guild.Upgrade : undefined,
  };
}, ['guild-upgrade-revision'], { revalidate: 60 });


type GuildUpgradePageProps = PageProps<{ id: string }>;

export default async function GuildUpgradePage({ params }: GuildUpgradePageProps) {
  const { language, id } = await params;
  const guildUpgradeId = Number(id);
  const [guildUpgrade, { revision, data }] = await Promise.all([
    getGuildUpgrade(guildUpgradeId),
    getRevision(guildUpgradeId, language),
    pageView('guild/upgrade', guildUpgradeId),
  ]);

  if(!guildUpgrade || !revision || !data) {
    notFound();
  }

  return (
    <DetailLayout title={data.name} breadcrumb="Guild Upgrade" icon={guildUpgrade.icon}>
      <p>{data.description}</p>

      {guildUpgrade.unlockedByItems.length > 0 && (
        <>
          <Headline id="items">Unlocked by</Headline>
          <ItemList>
            {guildUpgrade.unlockedByItems.map((item) => (
              <li key={item.id}><ItemLink item={item}/></li>
            ))}
          </ItemList>
        </>
      )}

      {guildUpgrade.recipeOutput && guildUpgrade.recipeOutput.length > 0 && (
        <>
          <Headline id="crafted-from">Crafted From</Headline>
          <RecipeBoxWrapper>
            {guildUpgrade.recipeOutput.map((recipe) => (
              <RecipeBox key={recipe.id} recipe={recipe} outputItem={recipe.outputItem}/>
            ))}
          </RecipeBoxWrapper>
        </>
      )}

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

export const generateMetadata = createMetadata<GuildUpgradePageProps>(async ({ params }) => {
  const { language, id } = await params;
  const skinId: number = Number(id);
  const guildUpgrade = await getGuildUpgrade(skinId);

  if(!guildUpgrade) {
    notFound();
  }

  return {
    title: localizedName(guildUpgrade, language)
  };
});
