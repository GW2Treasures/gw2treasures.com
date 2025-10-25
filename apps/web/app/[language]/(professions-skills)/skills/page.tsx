import { FormatDate } from '@/components/Format/FormatDate';
import { ItemList } from '@/components/ItemList/ItemList';
import { PageView } from '@/components/PageView/PageView';
import { SkillLink } from '@/components/Skill/SkillLink';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import type { Language } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

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

export default async function SkillPage() {
  const language = await getLanguage();
  const { recentlyAdded, recentlyUpdated } = await getSkills(language);

  return (
    <>
      <Headline id="recent">Recently added</Headline>
      <ItemList>
        {recentlyAdded.map((skill) => <li key={skill.id}><SkillLink skill={skill}/><FormatDate date={skill.createdAt} relative/></li>)}
      </ItemList>
      <Headline id="updated">Recently updated</Headline>
      <ItemList>
        {recentlyUpdated.map((revision) => <li key={revision.id}><SkillLink skill={revision.skillHistory[0].skill}/><FormatDate date={revision.createdAt} relative/></li>)}
      </ItemList>
      <PageView page="professions"/>
    </>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.skills'),
    url: '/skills',
  };
});
