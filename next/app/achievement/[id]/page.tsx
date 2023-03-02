import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '../../../lib/prisma';
import { getIconUrl } from '@/lib/getIconUrl';
import { Gw2Api } from 'gw2-api-types';
import { localizedName } from '../../../lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Separator } from '@/components/Layout/Separator';
import Icon from '../../../icons/Icon';
import { format } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';

async function getAchievement(id: number, language: Language) {
  const [achievement, revision] = await Promise.all([
    db.achievement.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementCategory: { include: { achievementGroup: true }},
      }
    }),
    db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}})
  ]);

  if(!achievement || !revision) {
    notFound();
  }

  return { achievement, revision };
}

async function AchievementPage({ params }: { params: { id: string }}) {
  const locale = 'en'; // TODO
  const id: number = Number(params.id);
  const language = (locale ?? 'en') as Language;

  const { achievement, revision } = await getAchievement(id, language);

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={achievement.icon && getIconUrl(achievement.icon, 64) || undefined} breadcrumb={`Achievements › ${achievement.achievementCategory?.achievementGroup ? localizedName(achievement.achievementCategory?.achievementGroup, language) : 'Unknown Group'} › ${achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Unknown Category'}`}>
      {data.description && (
        <p>{data.description}</p>
      )}

      <Headline id="objectives">Objectives</Headline>
      <p dangerouslySetInnerHTML={{ __html: format(data.requirement.replace('  ', ` ${data.tiers[data.tiers.length - 1].count} `)) }}/>

      <Headline id="tiers">Tiers</Headline>
      {data.tiers.map((tier) => (
        <div key={tier.count}>{tier.points} <Icon icon="achievementPoints"/>: <FormatNumber value={tier.count}/> objectives completed</div>
      ))}
      <Separator/>
      <div>Total: {data.tiers.reduce((total, tier) => total + tier.points, 0)} <Icon icon="achievementPoints"/></div>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};

export default AchievementPage;
