import type { Language } from '@gw2treasures/database';
import { SkillPageComponent } from '../component';
import type { Metadata } from 'next';
import { getRevision } from '../getSkill';
import { notFound } from 'next/navigation';

interface SkillRevisionPageProps {
  params: {
    language: Language;
    id: string;
    revisionId: string;
  }
}

export default function SkillPage({ params: { language, id, revisionId }}: SkillRevisionPageProps) {
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
};

export async function generateMetadata({ params: { language, id, revisionId }}: SkillRevisionPageProps): Promise<Metadata> {
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @ ${revisionId}`,
    robots: { index: false }
  };
};
