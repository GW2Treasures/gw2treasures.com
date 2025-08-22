import { SkillPageComponent } from '../component';
import { getRevision } from '../getSkill';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/next';
import { createMetadata } from '@/lib/metadata';
import { encode } from 'gw2e-chat-codes';
import { getLanguage } from '@/lib/translate';

type SkillRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function SkillPage({ params }: SkillRevisionPageProps) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<SkillRevisionPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || encode('skill', skillId) || id} @ ${revisionId}`,
    robots: { index: false }
  };
});
