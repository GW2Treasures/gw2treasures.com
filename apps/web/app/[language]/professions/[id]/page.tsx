import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import DetailLayout from '@/components/Layout/DetailLayout';
import { notFound } from 'next/navigation';
import { Json } from '@/components/Format/Json';
import type { Metadata } from 'next';
import { localizedName } from '@/lib/localizedName';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import type { Profession } from '@gw2api/types/data/profession';
import { getIconUrl } from '@/lib/getIconUrl';
import { getAlternateUrls } from '@/lib/url';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkillLink } from '@/components/Skill/SkillLink';
import { groupById } from '@gw2treasures/helper/group-by';
import { Fragment } from 'react';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import type { Skill } from '@gw2api/types/data/skill';
import { range } from '@gw2treasures/helper/range';
import { getProfessionColor } from '@/components/Profession/icon';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import { jsxJoin } from '@gw2treasures/ui/lib/jsx';
import { SpecializationLink } from '@/components/Specialization/SpecialiazationLink';
import { Specialization } from '@/components/Specialization/Specialization';
import { Trans } from '@/components/I18n/Trans';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { translate } from '@/lib/translate';

const getProfession = cache(async (id: string) => {
  const profession = await db.profession.findUnique({
    where: { id },
    include: {
      icon: true,
      iconBig: true,
      skills: { select: { ...linkPropertiesWithoutRarity, flags: true }},
      specializations: {
        select: {
          ...linkPropertiesWithoutRarity,
          current_de: true,
          current_en: true,
          current_es: true,
          current_fr: true,
          professionId: true,
          traits: { select: { ...linkPropertiesWithoutRarity, tier: true, slot: true }, orderBy: { order: 'asc' }}
        }
      },
    },
  });

  return profession;
}, ['profession'], { revalidate: 60 });

const getRevision = cache(async (id: string, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentProfession_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Profession : undefined,
  };
}, ['profession-revision'], { revalidate: 60 });


type ProfessionPageProps = PageProps<{ id: string }>;

export default async function ProfessionPage({ params }: ProfessionPageProps) {
  const { language, id } = await params;
  const [profession, { revision, data }] = await Promise.all([
    getProfession(id),
    getRevision(id, language),
    pageView(`professions/${id}`),
  ]);

  if(!profession || !revision || !data) {
    notFound();
  }

  const skills = groupById(profession.skills);
  const specializations = groupById(profession.specializations);
  const weapons = getWeaponInfo(data.weapons, skills);

  const breadcrumb = <Breadcrumb>{[<BreadcrumbItem key="p" name={translate('profession', language)} href="/professions"/>]}</Breadcrumb>;

  return (
    <DetailLayout title={data.name} breadcrumb={breadcrumb} icon={profession.iconBig} color={getProfessionColor(data.id)}>
      <Headline id="skills"><Trans id="professions.weapon-skills"/></Headline>
      <ItemList>
        {weapons.map((weapon) => (
          <li key={weapon.id} style={{ display: 'block', marginBottom: 32, breakInside: 'avoid' }}>
            <b><Trans id={`item.type.Weapon.${weapon.id}`}/></b>
            {weapon.specialization && <p style={{ marginBottom: 0, marginTop: 8 }}><Trans id="professions.weapon-skills.specialization"/>: <SpecializationLink specialization={specializations.get(weapon.specialization)!} icon={24}/></p>}
            {weapon.skillSets.map(({ requirement, skills: weaponSkills }) => (
              <div key={requirement === undefined ? '-' : Object.values(requirement).filter(isDefined).join('.')} style={{ marginTop: 16 }}>
                {(requirement?.attunement || requirement?.offhand || requirement?.underwater) && (
                  <div style={{ marginBottom: 8 }}>
                    {jsxJoin([
                      requirement?.attunement && <Trans key="attunement" id={`professions.weapon-skills.attunement.${requirement.attunement}`}/>,
                      requirement?.offhand && <Fragment key="offhand"><Trans id="professions.weapon-skills.offhand"/>: {requirement.offhand === 'Nothing' ? <Trans id="professions.weapon-skills.offhand.nothing"/> : <Trans id={`item.type.Weapon.${requirement.offhand}`}/>}</Fragment>,
                      requirement?.underwater && <Trans key="underwater" id="professions.weapon-skills.underwater"/>,
                    ].filter(isTruthy), <span style={{ color: 'var(--color-text-muted)' }}> ▪ </span>)}
                  </div>
                )}
                <FlexRow>
                  {range(5).map((index) => (
                    <Fragment key={index}>
                      {index === 3 && !weapon.flags.includes('TwoHand') && (
                        <div style={{ width: 2, height: 48, background: 'var(--color-border)' }}/>
                      )}
                      {weaponSkills[index]
                        ? <SkillLink icon={48} skill={skills.get(weaponSkills[index])!}>{null}</SkillLink>
                        : <div style={{ width: 48, height: 48, border: '1px solid var(--color-border-dark)', borderRadius: 2, background: 'var(--color-background-light)' }}/>}
                    </Fragment>
                  ))}
                </FlexRow>
              </div>
            ))}
          </li>
        ))}
      </ItemList>

      <Headline id="specializations"><Trans id="navigation.specializations"/></Headline>
      <ItemList style={{ columnWidth: 647 }}>
        {data.specializations.map((specializationId) => {
          const specialization = specializations.get(specializationId);
          return !specialization ? null : (
            <li key={specializationId} style={{ display: 'block', marginBottom: 32, breakInside: 'avoid' }}>
              <div id={specializationId.toString()} style={{ marginBottom: 8, fontWeight: 500 }}>
                {localizedName(specialization, language)}
              </div>
              <Specialization data={JSON.parse(specialization[`current_${language}`].data)} traits={specialization.traits}/>
            </li>
          );
        })}
      </ItemList>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export async function generateMetadata({ params }: ProfessionPageProps): Promise<Metadata> {
  const { language, id } = await params;
  const profession = await getProfession(id);

  if(!profession) {
    notFound();
  }

  return {
    title: localizedName(profession, language),
    openGraph: {
      images: profession.iconBig ? [{ url: getIconUrl(profession.iconBig, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/professions/${id}`, language)
  };
}

interface WeaponInfo {
  id: Profession.Weapon.Type,
  flags: Profession.Weapon.Flag[],
  specialization?: number,
  skillSets: {
    requirement?: SkillSetRequirement,
    skills: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, number>>
  }[],
}

interface SkillSetRequirement {
  attunement?: Skill.Attunement,
  underwater?: boolean,
  offhand?: Profession.Weapon.Type | 'Nothing',
}

function getWeaponInfo(weapons: Profession['weapons'], skills: Map<number, { flags: string[] }>): WeaponInfo[] {
  return (Object.entries(weapons) as [Profession.Weapon.Type, Profession.Weapon][]).map(([id, { flags, skills: weaponSkills, specialization }]) => {
    const requirements: SkillSetRequirement[] = [];

    for(const skill of weaponSkills) {
      const requirement = skillToRequirement(skill, flags, skills.get(skill.id)?.flags as Skill['flags'] ?? []);

      if(!requirements.some(matchesRequirement.bind(null, requirement))) {
        requirements.push(requirement);
      }
    }

    requirements.sort(compareRequirement);

    const skillSets = (requirements.length === 0 ? [undefined] : requirements)
      .map((requirement) => ({
        requirement,
        skills: Object.fromEntries(
          weaponSkills
            .filter((skill) => requirement === undefined || matchesRequirement(requirement, skillToRequirement(skill, flags, skills.get(skill.id)?.flags as Skill['flags'] ?? [])))
            .map(({ id, slot }) => [slotToIndex(slot), id])
        )
      }));

    return { id, specialization, flags, skillSets };
  });
}

function slotToIndex(slot: Skill.Slot.Weapon) {
  switch(slot) {
    case 'Weapon_1': return 0;
    case 'Weapon_2': return 1;
    case 'Weapon_3': return 2;
    case 'Weapon_4': return 3;
    case 'Weapon_5': return 4;
  }
}

function skillToRequirement(skill: Profession.Weapon.Skill, weaponFlags: Profession.Weapon.Flag[], skillFlags: Skill['flags']): SkillSetRequirement {
  return {
    attunement: skill.attunement,
    offhand: skill.offhand,
    underwater: weaponFlags.includes('Aquatic')
      ? !skillFlags.includes('NoUnderwater')
      : undefined,
  };
}

function compareRequirement(a: SkillSetRequirement, b: SkillSetRequirement) {
  // always show underwater last
  if(a.underwater !== undefined && b.underwater !== undefined) {
    return (+a.underwater) - (+b.underwater);
  }

  return 0;
}

function matchesRequirement(a: SkillSetRequirement, b: SkillSetRequirement) {
  return a?.attunement === b.attunement && a.offhand === b.offhand && a.underwater === b.underwater;
}
