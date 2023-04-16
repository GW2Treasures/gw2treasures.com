import { Language, MasteryRegion } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
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
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { SkinLink } from '@/components/Skin/SkinLink';
import { Table } from '@/components/Table/Table';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { AchievementInfobox } from '@/components/Achievement/AchievementInfobox';
import type * as CSS from 'csstype';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';

const MasteryColors: Record<MasteryRegion, CSS.Property.Color> = {
  'Tyria': '#FB8C00',
  'Maguuma': '#43A047',
  'Desert': '#D81B60',
  'Tundra': '#00ACC1',
  'Unknown': '#1E88E5',
};

const getAchievement = remember(60, async function getAchievement(id: number, language: Language) {
  const [achievement, revision] = await Promise.all([
    db.achievement.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementCategory: {
          select: {
            ...linkPropertiesWithoutRarity,
            categoryDisplayId: true,
            achievementGroup: { select: { name_de: true, name_en: true, name_es: true, name_fr: true }},
            categoryDisplay: { select: linkPropertiesWithoutRarity }
          }
        },
        prerequisiteFor: { select: linkPropertiesWithoutRarity },
        prerequisites: { select: linkPropertiesWithoutRarity },
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

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  const categoryAchievements = data.flags.includes('CategoryDisplay')
    ? await db.achievement.findMany({ where: { achievementCategoryId: achievement.achievementCategoryId, id: { not: achievement.id }, historic: false }, select: linkPropertiesWithoutRarity })
    : [];

  return { achievement, revision, categoryAchievements };
});

async function AchievementPage({ params: { id, language }}: { params: { language: Language, id: string }}) {
  const achievementId: number = Number(id);

  const { achievement, revision, categoryAchievements } = await getAchievement(achievementId, language);

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  return (
    <DetailLayout
      title={data.name}
      icon={achievement.icon}
      breadcrumb={`Achievements › ${achievement.achievementCategory?.achievementGroup ? localizedName(achievement.achievementCategory?.achievementGroup, language) : 'Unknown Group'} › ${achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Unknown Category'}`}
      infobox={<AchievementInfobox achievement={achievement} data={data} language={language}/>}
    >
      {achievement.removedFromApi && (
        <RemovedFromApiNotice type="achievement"/>
      )}

      {data.description && (
        <p dangerouslySetInnerHTML={{ __html: format(data.description) }}/>
      )}

      {data.flags.includes('RequiresUnlock') && (
        <>
          <Headline id="unlock">Unlock</Headline>
          <p>{data.locked_text || 'You have to unlock this achievement.'}</p>
        </>
      )}

      {achievement.id !== achievement.achievementCategory?.categoryDisplayId && achievement.achievementCategory?.categoryDisplay && (
        <>
          <Headline id="unlock">Part of</Headline>
          <AchievementLink achievement={achievement.achievementCategory.categoryDisplay}/>
        </>
      )}

      {data.prerequisites && data.prerequisites?.length > 0 && (
        <>
          <Headline id="prerequisites">Prerequisites</Headline>
          <ItemList>
            {data.prerequisites.map((prerequisiteId) => {
              const prerequisite = achievement.prerequisites.find(({ id }) => prerequisiteId === id);

              return (
                <li key={prerequisiteId}>{prerequisite ? <AchievementLink achievement={prerequisite}/> : `Unknown achievement ${prerequisiteId}`}</li>
              );
            })}
          </ItemList>
        </>
      )}

      <Headline id="objectives">Objectives</Headline>
      <p dangerouslySetInnerHTML={{ __html: format(data.requirement.replace('  ', ` ${data.tiers[data.tiers.length - 1].count} `)) }}/>

      {(data.bits || categoryAchievements.length > 0) && (
        <Table>
          <thead><tr><th {...{ width: 1 }} align="right">#</th><th {...{ width: 1 }}>Type</th><th>Objective</th></tr></thead>
          <tbody>
            {data.bits && data.bits.map((bit, index) => {
              switch(bit.type) {
                case 'Item': {
                  const item = achievement.bitsItem.find(({ id }) => id === bit.id);
                  return <tr key={bit.id}><td align="right">{index}</td><td>Item</td><td>{item ? (<ItemLink item={item}/>) : `Unknown item ${bit.id}`}</td></tr>;
                }
                case 'Skin': {
                  const skin = achievement.bitsSkin.find(({ id }) => id === bit.id);
                  return <tr key={bit.id}><td align="right">{index}</td><td>Skin</td><td>{skin ? (<SkinLink skin={skin}/>) : `Unknown skin ${bit.id}`}</td></tr>;
                }
                case 'Text': return bit.text !== '' && <tr key={bit.id}><td align="right">{index}</td><td>Text</td><td>{bit.text}</td></tr>;
                case 'Minipet': return <tr key={bit.id}><td align="right">{index}</td><td>Minipet</td><td>{bit.id}</td></tr>;
              }
            })}
            {categoryAchievements.map((achievement, index) => (
              <tr key={achievement.id}><td align="right">{(data.bits?.length || 0) + index}</td><td>Achievement</td><td><AchievementLink achievement={achievement}/></td></tr>
            ))}
          </tbody>
        </Table>
      )}

      <Headline id="tiers">Tiers</Headline>
      <table className={styles.tierTable}>
        <tbody>
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
        </tbody>
      </table>

      {data.rewards && (
        <>
          <Headline id="rewards">Rewards</Headline>
          <ItemList>
            {data.rewards.map((reward) => {
              switch(reward.type) {
                case 'Coins':
                  return (<li key="coins"><span><span className={styles.listIcon}><Icon icon="coins"/></span> <Coins value={reward.count!}/></span></li>);
                case 'Mastery':
                  return (<li key={reward.id}><span><span className={styles.listIcon} style={reward.region ? { '--icon-color': MasteryColors[reward.region] } : undefined}><Icon icon="mastery"/></span> {reward.region} Mastery</span></li>);
                case 'Title':
                  return <li key={reward.id}><span><span className={styles.listIcon}><Icon icon="achievement"/></span> Title {reward.id}</span></li>;
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

      {achievement.prerequisiteFor.length > 0 && (
        <>
          <Headline id="prerequisiteFor">Prerequisite For</Headline>
          <ItemList>
            {achievement.prerequisiteFor.map((prerequisite) => (
              <li key={prerequisite.id}><AchievementLink achievement={prerequisite}/></li>
            ))}
          </ItemList>
        </>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};

export default AchievementPage;
