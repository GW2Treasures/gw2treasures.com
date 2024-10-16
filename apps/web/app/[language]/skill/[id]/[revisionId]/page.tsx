import { SkillPageComponent } from '../component';
import type { Metadata } from 'next';
import { getRevision } from '../getSkill';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/next';

type SkillRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function SkillPage({ params }: SkillRevisionPageProps) {
  const { language, id, revisionId } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
}

export async function generateMetadata({ params }: SkillRevisionPageProps): Promise<Metadata> {
  const { language, id, revisionId } = await params;
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @ ${revisionId}`,
    robots: { index: false }
  };
}
