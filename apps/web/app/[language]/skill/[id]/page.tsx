import { SkillPageComponent } from './component';
import { notFound } from 'next/navigation';
import { parseIcon } from '@/lib/parseIcon';
import { getIconUrl } from '@/lib/getIconUrl';
import { getRevision } from './getSkill';
import type { PageProps } from '@/lib/next';
import { encode } from 'gw2e-chat-codes';
import { createMetadata } from '@/lib/metadata';
import { getTranslate } from '@/lib/translate';

export type SkillPageProps = PageProps<{ id: string }>;

export default async function SkillPage({ params }: SkillPageProps) {
  const { language, id } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
}

export const generateMetadata = createMetadata<SkillPageProps>(async ({ params }) => {
  const { language, id } = await params;
  const t = getTranslate(language);
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: data.name || encode('skill', skillId) || id,
    description: t('legendary-armory.relics.description'),
    url: `/skill/${id}`,
    image: icon ? { src: getIconUrl(icon, 64), width: 64, height: 64 } : undefined,
  };
});
