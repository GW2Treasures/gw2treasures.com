import { SkillPageComponent } from './component';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseIcon } from '@/lib/parseIcon';
import { getIconUrl } from '@/lib/getIconUrl';
import { getRevision } from './getSkill';
import { getAlternateUrls } from '@/lib/url';
import type { PageProps } from '@/lib/next';

export type SkillPageProps = PageProps<{ id: string }>;

export default async function SkillPage({ params }: SkillPageProps) {
  const { language, id } = await params;
  const skillId: number = Number(id);

  return <SkillPageComponent language={language} skillId={skillId}/>;
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { language, id } = await params;
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
    alternates: getAlternateUrls(`/skill/${id}`, language)
  };
}

