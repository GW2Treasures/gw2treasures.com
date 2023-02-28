import { Language } from '@prisma/client';
import { SkillPageComponent } from '../component';

function SkillPage({ params }: { params: { id: string, revisionId: string }}) {
  const locale = 'en'; // TODO
  const id: number = Number(params.id);
  const language = (locale ?? 'en') as Language;

  /* @ts-expect-error Server Component */
  return <SkillPageComponent language={language} skillId={id} revisionId={params.revisionId}/>;
};

export default SkillPage;
