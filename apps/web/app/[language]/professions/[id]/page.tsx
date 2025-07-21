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
import { isDefined } from '@gw2treasures/helper/is';

const getProfession = cache(async (id: string) => {
  const profession = await db.profession.findUnique({
    where: { id },
    include: {
      icon: true,
      iconBig: true,
      skills: { select: linkPropertiesWithoutRarity }
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
  const weapons = getWeaponInfo(data.weapons);

  return (
    <DetailLayout title={data.name} breadcrumb="Profession" icon={profession.iconBig} color={getProfessionColor(data.id)}>
      <Headline id="skills">Weapons</Headline>
      <ItemList>
        {weapons.map((weapon) => (
          <li key={weapon.id} style={{ display: 'block', marginBottom: 32, breakInside: 'avoid' }}>
            <b>{weapon.id}</b>
            {weapon.specialization && <p style={{ marginBottom: 0, marginTop: 8 }}>Requires specialization [{weapon.specialization}].</p>}
            {weapon.skillSets.map(({ requirement, skills: weaponSkills }) => (
              <div key={requirement === undefined ? '-' : Object.values(requirement).filter(isDefined).join('.')} style={{ marginTop: 12 }}>
                {(requirement?.attunement || requirement?.offhand || requirement?.underwater) && (
                  <div style={{ marginBottom: 8 }}>
                    {requirement?.attunement && (`${requirement.attunement} attunement`)}
                    {requirement?.offhand && (`With offhand ${requirement.offhand}`)}
                    {requirement?.underwater && 'Underwater'}
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
  offhand?: Profession.Weapon.Type,
}

function getWeaponInfo(weapons: Profession['weapons']): WeaponInfo[] {
  return (Object.entries(weapons) as [Profession.Weapon.Type, Profession.Weapon][]).map(([id, { flags, skills, specialization }]) => {
    const requirements: SkillSetRequirement[] = [];

    for(const skill of skills) {
      const requirement: SkillSetRequirement = {
        attunement: skill.attunement,
        offhand: skill.offhand,
      };

      if(!requirements.some(matchesRequirement.bind(null, requirement))) {
        requirements.push(requirement);
      }
    }

    const skillSets = (requirements.length === 0 ? [undefined] : requirements)
      .map((requirement) => ({
        requirement,
        skills: Object.fromEntries(
          skills
            .filter((skill) => requirement === undefined || matchesRequirement(requirement, skill))
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

function matchesRequirement(a: SkillSetRequirement, b: SkillSetRequirement) {
  return a?.attunement === b.attunement && a.offhand === b.offhand && a.underwater === b.underwater;
}
