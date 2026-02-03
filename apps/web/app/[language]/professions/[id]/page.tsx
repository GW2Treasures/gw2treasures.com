import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { Json } from '@/components/Format/Json';
import { Trans } from '@/components/I18n/Trans';
import { ItemList } from '@/components/ItemList/ItemList';
import DetailLayout from '@/components/Layout/DetailLayout';
import { getProfessionColor } from '@/components/Profession/icon';
import { SkillLink } from '@/components/Skill/SkillLink';
import { SpecializationLink } from '@/components/Specialization/SpecialiazationLink';
import { Specialization } from '@/components/Specialization/Specialization';
import { TraitLink } from '@/components/Trait/TraitLink';
import { cache } from '@/lib/cache';
import { getIconUrl } from '@/lib/getIconUrl';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { localizedName } from '@/lib/localizedName';
import type { PageProps } from '@/lib/next';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import type { Profession } from '@gw2api/types/data/profession';
import type { Skill } from '@gw2api/types/data/skill';
import type { Language } from '@gw2treasures/database';
import { groupById } from '@gw2treasures/helper/group-by';
import { isDefined, isTruthy } from '@gw2treasures/helper/is';
import { range } from '@gw2treasures/helper/range';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { jsxJoin } from '@gw2treasures/ui/lib/jsx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

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
  const language = await getLanguage();
  const { id } = await params;
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
  const traits = groupById(profession.specializations.flatMap((specialization) => specialization.traits));

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

      <Headline id="training">Training</Headline>
      {data.training.map((training) => (
        <Fragment key={training.id}>
          <div id={`training-${training.id}`} style={{ display: 'block', marginBottom: 16 }}>
            <b>{training.name}</b> ({training.track.at(-1)?.cost} <Icon icon="heropoint"/> total)
          </div>

          <ItemList>
            {training.track.map((track, i) => (
              <li key={`${track.type}-${track.skill_id ?? track.trait_id}`}>
                {track.type === 'Skill'
                  ? (skills.has(track.skill_id) ? <SkillLink skill={skills.get(track.skill_id)!}/> : <span>Unknown Skill ({encodeChatlink(ChatlinkType.Skill, track.skill_id)})</span>)
                  : (traits.has(track.trait_id) ? <TraitLink trait={traits.get(track.trait_id)!}/> : <span>Unknown Trait ({encodeChatlink(ChatlinkType.Trait, track.trait_id)})</span>)
                }
                <span style={{ color: 'var(--color-text-muted)' }}>{track.cost - (training.track[i - 1]?.cost || 0)} <Tip tip="Heropoint"><Icon icon="heropoint"/></Tip></span>
              </li>
            ))}
          </ItemList>
        </Fragment>
      ))}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}

export async function generateMetadata({ params }: ProfessionPageProps): Promise<Metadata> {
  const language = await getLanguage();
  const { id } = await params;
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
    skills: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, number>>,
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
