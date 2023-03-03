import { getLanguage } from '@/components/I18n/getLanguage';
import { SkillPageComponent } from './component';

function SkillPage({ params }: { params: { id: string }}) {
  const language = getLanguage();
  const id: number = Number(params.id);

  /* @ts-expect-error Server Component */
  return <SkillPageComponent language={language} skillId={id}/>;
};

export default SkillPage;
