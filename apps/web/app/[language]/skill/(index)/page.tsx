import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import type { Language } from '@gw2treasures/database';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { SkillLink } from '@/components/Skill/SkillLink';
import { FormatDate } from '@/components/Format/FormatDate';
import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';

const getSkills = cache(async (language: Language) => {
  const [recentlyAdded, recentlyUpdated] = await Promise.all([
    db.skill.findMany({
      select: { ...linkPropertiesWithoutRarity, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 48,
    }),
    db.revision.findMany({
      where: { entity: 'Skill', type: 'Update', language },
      select: { id: true, createdAt: true, skillHistory: { select: { skill: { select: linkPropertiesWithoutRarity }}}},
      orderBy: { createdAt: 'desc' },
      take: 48,
    })
  ]);

  return { recentlyAdded, recentlyUpdated };
}, ['skills'], { revalidate: 60 });

export default async function SkillPage({ params }: PageProps) {
  const { language } = await params;
  const { recentlyAdded, recentlyUpdated } = await getSkills(language);

  return (
    <HeroLayout hero={<Headline id="skills">Skills</Headline>} toc>
      <Headline id="recent">Recently added</Headline>
      <ItemList>
        {recentlyAdded.map((skill) => <li key={skill.id}><SkillLink skill={skill}/><FormatDate date={skill.createdAt} relative/></li>)}
      </ItemList>
      <Headline id="updated">Recently updated</Headline>
      <ItemList>
        {recentlyUpdated.map((revision) => <li key={revision.id}><SkillLink skill={revision.skillHistory[0].skill}/><FormatDate date={revision.createdAt} relative/></li>)}
      </ItemList>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Skills'
});
