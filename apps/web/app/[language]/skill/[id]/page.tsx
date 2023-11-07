import type { Language } from '@gw2treasures/database';
import { SkillPageComponent } from './component';

function SkillPage({ params: { language, id }}: { params: { language: Language, id: string }}) {
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
};

export default SkillPage;
