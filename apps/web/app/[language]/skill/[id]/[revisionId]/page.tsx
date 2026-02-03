import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';
import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { notFound } from 'next/navigation';
import { SkillPageComponent } from '../component';
import { getRevision } from '../getSkill';

export default async function SkillPage({ params }: PageProps<'/[language]/skill/[id]/[revisionId]'>) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<PageProps<'/[language]/skill/[id]/[revisionId]'>>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || encodeChatlink(ChatlinkType.Skill, skillId)} @ ${revisionId}`,
    robots: { index: false }
  };
});
