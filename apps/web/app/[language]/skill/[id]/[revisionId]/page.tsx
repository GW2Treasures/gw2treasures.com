import { SkillPageComponent } from '../component';
import type { Metadata } from 'next';
import { getRevision } from '../getSkill';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/lib/next';

type SkillRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function SkillPage(props: SkillRevisionPageProps) {
  const params = await props.params;

  const {
    language,
    id,
    revisionId
  } = params;

  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
}

export async function generateMetadata(props: SkillRevisionPageProps): Promise<Metadata> {
  const params = await props.params;

  const {
    language,
    id,
    revisionId
  } = params;

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
