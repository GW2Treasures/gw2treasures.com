import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { getIconUrl } from '@/lib/getIconUrl';
import { Gw2Api } from 'gw2-api-types';
import { localizedName } from '@/lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { Separator } from '@/components/Layout/Separator';
import Icon from '../../../../icons/Icon';
import { format } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';
import { remember } from '@/lib/remember';
import styles from './page.module.css';
import { Coins } from '@/components/Format/Coins';
import { ItemList } from '@/components/ItemList/ItemList';
import { linkProperties } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { SkinLink } from '@/components/Skin/SkinLink';

const getAchievement = remember(60, async function getAchievement(id: number, language: Language) {
  const [achievement, revision] = await Promise.all([
    db.achievement.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementCategory: { include: { achievementGroup: true }},
        bitsItem: { select: linkProperties },
        bitsSkin: { select: linkProperties },
        rewardsItem: { select: linkProperties },
      }
    }),
    db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}})
  ]);

  if(!achievement || !revision) {
    notFound();
  }

  return { achievement, revision };
});

async function AchievementPage({ params: { id, language }}: { params: { language: Language, id: string }}) {
  const achievementId: number = Number(id);

  const { achievement, revision } = await getAchievement(achievementId, language);

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={achievement.icon && getIconUrl(achievement.icon, 64) || undefined} breadcrumb={`Achievements › ${achievement.achievementCategory?.achievementGroup ? localizedName(achievement.achievementCategory?.achievementGroup, language) : 'Unknown Group'} › ${achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Unknown Category'}`}>
      {data.description && (
        <p>{data.description}</p>
      )}

      <Headline id="objectives">Objectives</Headline>
      <p dangerouslySetInnerHTML={{ __html: format(data.requirement.replace('  ', ` ${data.tiers[data.tiers.length - 1].count} `)) }}/>

      {data.bits && (
        <ItemList>
          {data.bits?.map((bit) => {
            switch(bit.type) {
              case 'Item': {
                const item = achievement.bitsItem.find(({ id }) => id === bit.id);
                return <li key={bit.id}>{item ? (<ItemLink item={item}/>) : `Unknown item ${bit.id}`}</li>;
              }
              case 'Skin': {
                const skin = achievement.bitsSkin.find(({ id }) => id === bit.id);
                return <li key={bit.id}>{skin ? (<SkinLink skin={skin}/>) : `Unknown skin ${bit.id}`}</li>;
              }
              case 'Text': return bit.text;
              case 'Minipet': return `Minipet ${bit.id}`;
            }
          })}
        </ItemList>
      )}

      <Headline id="tiers">Tiers</Headline>
      <table className={styles.tierTable}>
        <tr>
          <th>Objectives</th>
          {data.tiers.map((tier) => (
            <td key={tier.count}><FormatNumber value={tier.count}/></td>
          ))}
          <td>Total</td>
        </tr>
        <tr>
          <th>Achievement Points</th>
          {data.tiers.map((tier) => (
            <td key={tier.count}>{tier.points} <Icon icon="achievementPoints"/></td>
          ))}
          <td>{data.tiers.reduce((total, tier) => total + tier.points, 0)} <Icon icon="achievementPoints"/></td>
        </tr>
      </table>

      {data.rewards && (
        <>
          <Headline id="rewards">Rewards</Headline>
          <ItemList>
            {data.rewards.map((reward) => {
              switch(reward.type) {
                case 'Coins':
                  return (<li key={reward.id}><Coins value={reward.count!}/></li>);
                case 'Mastery':
                  return (<li key={reward.id}><span><Icon icon="mastery"/> {reward.region} Mastery</span></li>);
                case 'Title':
                  return <li key={reward.id}>Title {reward.id}</li>;
                case 'Item':
                  const item = achievement.rewardsItem.find(({ id }) => id === reward.id);
                  return (
                    <li key={reward.id}>
                      {item ? (<ItemLink item={item}/>) : `Unknown item ${reward.id}`}
                      {reward.count && reward.count > 1 && (<span>&times;{reward.count}</span>)}
                    </li>
                  );
              }
            })}
          </ItemList>
        </>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};

export default AchievementPage;
