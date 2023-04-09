import { Language } from '@gw2treasures/database';
import { SkillPageComponent } from '../component';

function SkillPage({ params: { language, id, revisionId }}: { params: { language: Language, id: string, revisionId: string }}) {
  const skillId: number = Number(id);

  /* @ts-expect-error Server Component */
  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
};

export default SkillPage;
