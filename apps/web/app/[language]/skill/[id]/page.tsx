import { getIconUrl } from '@/lib/getIconUrl';
import { createMetadata } from '@/lib/metadata';
import { parseIcon } from '@/lib/parseIcon';
import { getLanguage, getTranslate } from '@/lib/translate';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { notFound } from 'next/navigation';
import { SkillPageComponent } from './component';
import { getRevision } from './getSkill';


export default async function SkillPage({ params }: PageProps<'/[language]/skill/[id]'>) {
  const language = await getLanguage();
  const { id } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
}

export const generateMetadata = createMetadata<PageProps<'/[language]/skill/[id]'>>(async ({ params }) => {
  const language = await getLanguage();
  const { id } = await params;
  const t = getTranslate(language);
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: data.name || encodeChatlink(ChatlinkType.Skill, skillId),
    description: t('legendary-armory.relics.description'),
    url: `/skill/${id}`,
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
  };
});
