import type { Language } from '@gw2treasures/database';
import { SkillPageComponent } from './component';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseIcon } from '@/lib/parseIcon';
import { getIconUrl } from '@/lib/getIconUrl';
import { getRevision } from './getSkill';
import { getAlternateUrls } from '@/lib/url';

export interface SkillPageProps {
  params: {
    language: Language;
    id: string;
  }
}

export default function SkillPage({ params: { language, id }}: SkillPageProps) {
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
}

export async function generateMetadata({ params: { language, id }}: SkillPageProps): Promise<Metadata> {
  const skillId = Number(id);
  const { data } = await getRevision(skillId, language);

  if(!data) {
    notFound();
  }

  const icon = parseIcon(data.icon);

  return {
    title: data.name || id,
    openGraph: {
      images: icon ? [{ url: getIconUrl(icon, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/skill/${id}`)
  };
}

