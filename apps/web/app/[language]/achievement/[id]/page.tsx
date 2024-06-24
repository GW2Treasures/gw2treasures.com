/* eslint-disable react/no-array-index-key */
import type { Language, MasteryRegion } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import type { Gw2Api } from 'gw2-api-types';
import { localizedName } from '@/lib/localizedName';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Icon } from '@gw2treasures/ui';
import { format, strip } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Coins } from '@/components/Format/Coins';
import { ItemList } from '@/components/ItemList/ItemList';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { SkinLink } from '@/components/Skin/SkinLink';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { AchievementInfobox } from '@/components/Achievement/AchievementInfobox';
import type * as CSS from 'csstype';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import Link from 'next/link';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import type { Metadata } from 'next';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { TierTable } from './tier-table';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { getAlternateUrls } from '@/lib/url';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { getTranslate } from '@/lib/translate';
import { getIconUrl } from '@/lib/getIconUrl';

const MasteryColors: Record<MasteryRegion, CSS.Property.Color> = {
  'Tyria': '#FB8C00', //   core
  'Maguuma': '#43A047', // HoT
  'Desert': '#D81B60', //  PoF
  'Tundra': '#00ACC1', //  Icebrood
  'Jade': '#1E88E5', //    EoD
  'Sky': '#F3D71F', //     SotO
  'Unknown': 'currentColor',
};

const notPartOfCategoryDisplayFlags = ['Repeatable', 'RequiresUnlock', 'Hidden', 'Weekly', 'IgnoreNearlyComplete'];

export interface AchievementPageProps {
  params: {
    language: Language;
    id: string;
  }
}

const getAchievement = cache(async (id: number, language: Language) => {
  const [achievement, revision] = await Promise.all([
    db.achievement.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementCategory: {
          select: {
            ...linkPropertiesWithoutRarity,
            categoryDisplayId: true,
            achievementGroup: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }},
            categoryDisplay: { select: linkPropertiesWithoutRarity }
          }
        },
        prerequisiteFor: { select: linkPropertiesWithoutRarity },
        prerequisites: { select: linkPropertiesWithoutRarity },
        bitsItem: { select: linkProperties },
        bitsSkin: { select: linkProperties },
        rewardsItem: { select: linkProperties },
        rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}
      }
    }),
    db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}})
  ]);

  if(!achievement || !revision) {
    notFound();
  }

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  const categoryAchievements = data.flags.includes('CategoryDisplay')
    ? await db.achievement.findMany({
        where: {
          achievementCategoryId: achievement.achievementCategoryId,
          id: { not: achievement.id },
          historic: false,
          NOT: { flags: { hasSome: notPartOfCategoryDisplayFlags }}
        },
        include: {
          icon: true,
        }
      })
    : [];

  return { achievement, revision, categoryAchievements };
}, ['achievement'], { revalidate: 60 });

async function AchievementPage({ params: { id, language }}: AchievementPageProps) {
  const achievementId: number = Number(id);

  const { achievement, revision, categoryAchievements } = await getAchievement(achievementId, language);
  await pageView('achievement', achievementId);

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  const Bits = data.bits && data.bits.length > 0 && !data.flags.includes('CategoryDisplay') ? createDataTable(data.bits, (_, index) => index) : undefined;
  const CategoryAchievements = data.flags.includes('CategoryDisplay') && categoryAchievements.length > 0 ? createDataTable(categoryAchievements, (achievement) => achievement.id) : undefined;

  const t = getTranslate(language);

  return (
    <DetailLayout
      color={achievement.icon?.color ?? undefined}
      title={data.name}
      icon={achievement.icon}
      breadcrumb={(
        <Breadcrumb>
          <BreadcrumbItem href="/achievement" name={t('navigation.achievements')}/>
          {achievement.achievementCategory?.achievementGroup ? <BreadcrumbItem href={`/achievement#${achievement.achievementCategory.achievementGroup.id}`} name={localizedName(achievement.achievementCategory.achievementGroup, language)}/> : <BreadcrumbItem name="Unknown Group"/>}
          {achievement.achievementCategory ? <BreadcrumbItem name={localizedName(achievement.achievementCategory, language)} href={`/achievement/category/${achievement.achievementCategoryId}`}><AchievementCategoryLink achievementCategory={achievement.achievementCategory} icon="none"/></BreadcrumbItem> : <BreadcrumbItem name="Unknown Category"/>}
        </Breadcrumb>
      )}
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

      {achievement.id !== achievement.achievementCategory?.categoryDisplayId && achievement.achievementCategory?.categoryDisplay && !data.flags.some((flag) => notPartOfCategoryDisplayFlags.includes(flag)) && (
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

      {(data.requirement || (data.bits && data.bits.length > 0) || categoryAchievements.length > 0) && (
        <>
          <Headline id="objectives" actions={(
            <FlexRow>
              {Bits && <ColumnSelect table={Bits}/>}
              {CategoryAchievements && <ColumnSelect table={CategoryAchievements}/>}
            </FlexRow>
          )}
          >
            Objectives
          </Headline>
          {data.requirement && (
            <p dangerouslySetInnerHTML={{ __html: format(data.requirement.replace(/( |^)\/?( |$)/g, `$1${data.tiers[data.tiers.length - 1].count}$2`)) }}/>
          )}

          {Bits && (
            <Bits.Table>
              <Bits.Column id="index" title="Index" small align="right" hidden>{(_, index) => index}</Bits.Column>
              <Bits.Column id="type" title="Type" small hidden>{({ type }) => type}</Bits.Column>
              <Bits.Column id="objective" title="Objective">
                {(bit, index) => {
                  switch(bit.type) {
                    case 'Item':
                      const item = achievement.bitsItem.find(({ id }) => id === bit.id);
                      return item ? (<ItemLink item={item}/>) : <UnknownItem id={bit.id}/>;
                    case 'Skin':
                      const skin = achievement.bitsSkin.find(({ id }) => id === bit.id);
                      return skin ? (<SkinLink skin={skin}/>) : `Unknown skin ${bit.id}`;
                    case 'Text':
                      return bit.text || `Objective #${index + 1}`;
                    case 'Minipet':
                      return `Minipet ${bit.id}`;
                  }
                }}
              </Bits.Column>
              <Bits.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
                {(_, index) => <AccountAchievementProgressRow achievement={achievement} bitId={index}/>}
              </Bits.DynamicColumns>
            </Bits.Table>
          )}

          {CategoryAchievements && (
            <CategoryAchievements.Table>
              <CategoryAchievements.Column id="id" title="ID" small align="right" hidden sortBy="id">{({ id }) => id}</CategoryAchievements.Column>
              <CategoryAchievements.Column id="achievement" title="Achievement">{(achievement) => <AchievementLink achievement={achievement}/>}</CategoryAchievements.Column>
              <CategoryAchievements.Column id="points" title="AP" align="right" hidden sortBy="points">{({ points }) => <AchievementPoints points={points}/>}</CategoryAchievements.Column>
              <CategoryAchievements.Column id="unlocks" title="Unlocks" align="right" hidden sortBy="unlocks">{({ unlocks }) => unlocks && <FormatNumber value={Math.round(unlocks * 1000) / 10} unit="%"/>}</CategoryAchievements.Column>
              <CategoryAchievements.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
                {(achievement) => <AccountAchievementProgressRow achievement={achievement}/>}
              </CategoryAchievements.DynamicColumns>
            </CategoryAchievements.Table>
          )}
        </>
      )}

      <Headline id="tiers">Tiers</Headline>
      <TierTable achievement={data}/>

      {data.rewards && (
        <>
          <Headline id="rewards">Rewards</Headline>
          <ItemList>
            {data.rewards.map((reward) => {
              switch(reward.type) {
                case 'Coins':
                  return (<li key="coins"><FlexRow><span className={styles.listIcon}><Icon icon="coins"/></span> <Coins value={reward.count!}/></FlexRow></li>);
                case 'Mastery':
                  return (
                    <li key={reward.id}>
                      <FlexRow>
                        <span className={styles.listIcon} style={reward.region ? { '--icon-color': MasteryColors[reward.region], backgroundColor: `${MasteryColors[reward.region]}22` } : undefined}><Icon icon="mastery"/></span>
                        {reward.region} Mastery
                      </FlexRow>
                    </li>
                  );
                case 'Title':
                  const title = achievement.rewardsTitle.find(({ id }) => id === reward.id);
                  return (
                    <li key={reward.id}>
                      <FlexRow>
                        <span className={styles.listIcon}>
                          <Icon icon="title"/>
                        </span>
                        {title ? <span dangerouslySetInnerHTML={{ __html: format(localizedName(title, language)) }}/> : `Unknown (${reward.id})` }
                      </FlexRow>
                    </li>
                  );
                case 'Item':
                  const item = achievement.rewardsItem.find(({ id }) => id === reward.id);
                  return (
                    <li key={reward.id}>
                      {item ? (<ItemLink item={item}/>) : <UnknownItem id={reward.id}/>}
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

export async function generateMetadata({ params }: AchievementPageProps): Promise<Metadata> {
  const id = Number(params.id);

  const achievement = await db.achievement.findUnique({
    where: { id },
    select: {
      name_de: params.language === 'de',
      name_en: params.language === 'en',
      name_es: params.language === 'es',
      name_fr: params.language === 'fr',
      icon: true,
      current_de: params.language === 'de' ? { select: { data: true }} : false,
      current_en: params.language === 'en' ? { select: { data: true }} : false,
      current_es: params.language === 'es' ? { select: { data: true }} : false,
      current_fr: params.language === 'fr' ? { select: { data: true }} : false,
    }
  });

  if(!achievement) {
    notFound();
  }

  const data: Gw2Api.Achievement = JSON.parse(achievement[`current_${params.language}`].data);

  const description = [
    strip(data.description),
    data.requirement && strip(data.requirement.replace(/( |^)\/?( |$)/g, `$1${data.tiers[data.tiers.length - 1].count}$2`))
  ].filter(Boolean).join('\n\n');

  return {
    title: localizedName(achievement, params.language),
    description,
    openGraph: {
      images: achievement.icon ? [{ url: getIconUrl(achievement.icon, 64), width: 64, height: 64, type: 'image/png' }] : []
    },
    twitter: { card: 'summary' },
    alternates: getAlternateUrls(`/achievement/${id}`),
  };
}
