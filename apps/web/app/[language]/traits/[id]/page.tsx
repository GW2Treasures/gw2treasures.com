import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import DetailLayout from '@/components/Layout/DetailLayout';
import { getProfessionColor } from '@/components/Profession/icon';
import { TraitTooltip } from '@/components/Trait/TraitTooltip';
import { cache } from '@/lib/cache';
import { localizedName, selectLocalizedProp } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import type { Profession } from '@gw2api/types/data/profession';
import type { Trait } from '@gw2api/types/data/trait';
import type { Language } from '@gw2treasures/database';
import { notFound } from 'next/navigation';

export type TraitPageProps = PageProps<{ id: string }>;

const getTrait = cache(async (id: number, language: Language) => {
  const [trait] = await Promise.all([
    db.trait.findUnique({
      where: { id },
      include: {
        icon: true,
        specialization: { select: { professionId: true, ...selectLocalizedProp('name', language) }},
        ...selectLocalizedProp('current', language)
      }
    }),
  ]);

  if(!trait) {
    notFound();
  }

  const revision = trait[`current_${language}`];
  const data = JSON.parse(revision.data) as Trait;

  return { trait, revision, data };
}, ['get-trait'], { });

export default async function TraitPage({ params }: TraitPageProps) {
  const { language, id } = await params;
  const traitId = Number(id);

  const { trait, data } = await getTrait(traitId, language);

  const profession = trait.specialization?.professionId as Profession.Id | undefined;

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem name="Trait"/>
      {profession && <BreadcrumbItem name={profession} href={`/professions/${profession}`}/>}
      {trait.specialization && <BreadcrumbItem name={localizedName(trait.specialization, language)} href={`/professions/${profession}#${trait.specializationId}`}/>}
    </Breadcrumb>
  );

  return (
    <DetailLayout title={data.name}
      breadcrumb={breadcrumb}
      icon={trait.icon}
      color={getProfessionColor(profession)}
    >
      <TraitTooltip trait={data} language={language} hideTitle/>
    </DetailLayout>
  );
}

export const generateMetadata = createMetadata<TraitPageProps>(async ({ params }) => {
  const { language, id } = await params;
  const traitId = Number(id);

  const { trait, data } = await getTrait(traitId, language);

  return {
    title: localizedName(trait, language),
    description: data.description,
    icon: trait.icon
  };
});
