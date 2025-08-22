import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { Json } from '@/components/Format/Json';
import { ItemList } from '@/components/ItemList/ItemList';
import DetailLayout from '@/components/Layout/DetailLayout';
import { getProfessionColor } from '@/components/Profession/icon';
import { SkillLink } from '@/components/Skill/SkillLink';
import { TraitInfobox } from '@/components/Trait/TraitInfobox';
import { TraitLink } from '@/components/Trait/TraitLink';
import { TraitTooltip } from '@/components/Trait/TraitTooltip';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { localizedName, selectLocalizedProp, type LocalizedEntity } from '@/lib/localizedName';
import { createMetadata } from '@/lib/metadata';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getLanguage } from '@/lib/translate';
import type { Profession } from '@gw2api/types/data/profession';
import type { Trait } from '@gw2api/types/data/trait';
import type { Language } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { notFound } from 'next/navigation';

export type TraitPageProps = PageProps<{ id: string }>;

const getTrait = cache(async (id: number, language: Language) => {
  const [trait] = await Promise.all([
    db.trait.findUnique({
      where: { id },
      include: {
        icon: true,
        ...selectLocalizedProp('current', language),

        specialization: { select: { profession: { select: { id: true, ...selectLocalizedProp('name', language) }}, ...selectLocalizedProp('name', language) }},

        affectedByTraits: { select: { ...linkPropertiesWithoutRarity, slot: true }},
        affectsSkills: { select: linkPropertiesWithoutRarity },
        affectsTraits: { select: { ...linkPropertiesWithoutRarity, slot: true }},
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
  const language = await getLanguage();
  const { id } = await params;
  const traitId = Number(id);

  const { trait, data } = await getTrait(traitId, language);

  const profession = trait.specialization ? trait.specialization.profession as { id: Profession.Id } & LocalizedEntity : undefined;

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem name="Trait"/>
      {profession && <BreadcrumbItem name={localizedName(profession, language)} href={`/professions/${profession.id}`}/>}
      {trait.specialization && <BreadcrumbItem name={localizedName(trait.specialization, language)} href={`/professions/${trait.specialization.profession.id}#${trait.specializationId}`}/>}
    </Breadcrumb>
  );

  return (
    <DetailLayout title={data.name}
      breadcrumb={breadcrumb}
      icon={trait.icon}
      iconType={trait.slot === 'Major' ? 'trait-major' : 'trait-minor'}
      color={getProfessionColor(profession?.id)}
      infobox={<TraitInfobox trait={trait} data={data} language={language}/>}
    >
      <TraitTooltip trait={data} language={language} hideTitle/>

      {trait.affectedByTraits.length > 0 && (
        <>
          <Headline id="affected-by">Affected by</Headline>
          <ItemList>
            {trait.affectedByTraits.map((trait) => (
              <li key={trait.id}><TraitLink trait={trait}/></li>
            ))}
          </ItemList>
        </>
      )}

      {trait.affectsTraits.length > 0 && (
        <>
          <Headline id="affected-traits">Affected Traits</Headline>
          <ItemList>
            {trait.affectsTraits.map((trait) => (
              <li key={trait.id}><TraitLink trait={trait}/></li>
            ))}
          </ItemList>
        </>
      )}

      {trait.affectsSkills.length > 0 && (
        <>
          <Headline id="affected-skills">Affected Skills</Headline>
          <ItemList>
            {trait.affectsSkills.map((skill) => (
              <li key={skill.id}><SkillLink skill={skill}/></li>
            ))}
          </ItemList>
        </>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export const generateMetadata = createMetadata<TraitPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const traitId = Number(id);

  const { trait, data } = await getTrait(traitId, language);

  return {
    title: localizedName(trait, language),
    description: data.description,
    icon: trait.icon
  };
});
