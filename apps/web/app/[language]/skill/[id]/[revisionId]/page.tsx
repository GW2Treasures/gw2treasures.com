import type { Language } from '@gw2treasures/database';
import { SkillPageComponent } from '../component';

function SkillPage({ params: { language, id, revisionId }}: { params: { language: Language, id: string, revisionId: string }}) {
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId} revisionId={revisionId}/>;
};

export default SkillPage;
