import { getIconUrl } from '@/lib/getIconUrl';
import { createMetadata } from '@/lib/metadata';
import { parseIcon } from '@/lib/parseIcon';
import { getLanguage } from '@/lib/translate';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { notFound } from 'next/navigation';
import { SkillPageComponent } from './component';
import { getRevision } from './getSkill';
import { stripGw2Markup } from '@gw2/markup-strip';


export default async function SkillPage({ params }: PageProps<'/[language]/skill/[id]'>) {
  const language = await getLanguage();
  const { id } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
}

export const generateMetadata = createMetadata<PageProps<'/[language]/skill/[id]'>>(async ({ params }, { language }) => {
  const { id } = await params;
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: stripGw2Markup(data.name) || encodeChatlink(ChatlinkType.Skill, skillId),
    description: stripGw2Markup(data.description) || undefined,
    url: `/skill/${id}`,
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
  };
});
