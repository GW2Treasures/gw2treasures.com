import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { localizedName } from '@/lib/localizedName';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Icon } from '@gw2treasures/ui';
import { format } from 'gw2-tooltip-html';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Coins } from '@/components/Format/Coins';
import { ItemList } from '@/components/ItemList/ItemList';
import { getLinkProperties, linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { SkinLink } from '@/components/Skin/SkinLink';
import { MiniLink } from '@/components/Mini/MiniLink';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { AchievementInfobox } from '@/components/Achievement/AchievementInfobox';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { TierTable } from './tier-table';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { getTranslate } from '@/lib/translate';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import type { ReactNode } from 'react';
import { Mastery, MasteryColors } from '@/components/Achievement/Mastery';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { FormatDate } from '@/components/Format/FormatDate';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import Link from 'next/link';
import { AchievementLinkTooltip } from '@/components/Achievement/AchievementLinkTooltip';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { getRevision } from './data';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';


const notPartOfCategoryDisplayFlags: AchievementFlags[] = ['Repeatable', 'RequiresUnlock', 'Hidden', 'Daily', 'Weekly', 'IgnoreNearlyComplete'];

export interface AchievementPageComponentProps {
  language: Language,
  achievementId: number,
  revisionId?: string,
}

const getAchievement = cache(async (id: number, language: Language, revisionId?: string) => {
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
        bitsMini: { select: linkPropertiesWithoutRarity },
        rewardsItem: { select: linkProperties },
        rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }},
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
          where: { revision: { language }},
          orderBy: { revision: { createdAt: 'desc' }}
        },
      }
    }),
    getRevision(id, language, revisionId)
  ]);

  if(!achievement || !revision.data) {
    notFound();
  }

  const categoryAchievements = revision.data.flags.includes('CategoryDisplay')
    ? await db.achievement.findMany({
        where: {
          achievementCategoryId: achievement.achievementCategoryId,
          id: { not: achievement.id },
          historic: false,
          NOT: { flags: { hasSome: notPartOfCategoryDisplayFlags }}
        },
        include: {
          icon: true,
          rewardsItem: { select: linkProperties },
          rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}
        }
      })
    : [];

  return { achievement, revision, categoryAchievements };
}, ['achievement'], { revalidate: 60 });

export async function AchievementPageComponent({ language, achievementId, revisionId }: AchievementPageComponentProps) {
  const { achievement, revision: { revision, data }, categoryAchievements } = await getAchievement(achievementId, language, revisionId);
  await pageView('achievement', achievementId);

  // 404 if item doesn't exist
  if(!achievement || !revision || !data) {
    notFound();
  }

  const fixedRevision = revisionId !== undefined;

  const hasCategoryAchievements = data.flags.includes('CategoryDisplay') && data.type !== 'ItemSet' && categoryAchievements.length > 0;
  const Bits = data.bits && data.bits.length > 0 && !hasCategoryAchievements ? createDataTable(data.bits, (_, index) => index) : undefined;
  const OptionalCategoryAchievementTable = hasCategoryAchievements ? AchievementTable : ({ children }: { children: (t: ReactNode, c: ReactNode) => ReactNode }) => children(null, null);
  // const CategoryAchievements = hasCategoryAchievements ? createDataTable(categoryAchievements, (achievement) => achievement.id) : undefined;

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
      {achievement[`currentId_${language}`] !== revision.id && (
        <Notice icon="revision">You are viewing an old revision of this achievement{revision.buildId !== 0 && (<> (<Link href={`/build/${revision.buildId}`}>Build {revision.buildId}</Link>)</>)}. Some data is only available when viewing the latest version. <Link href={`/achievement/${achievement.id}`}>View latest</Link>.</Notice>
      )}
      {achievement[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice icon="revision">You are viewing this achievement at a fixed revision{revision.buildId !== 0 && (<> (<Link href={`/build/${revision.buildId}`}>Build {revision.buildId}</Link>)</>)}. Some data is only available when viewing the latest version. <Link href={`/achievement/${achievement.id}`}>View latest</Link>.</Notice>
      )}
      {!fixedRevision && achievement.removedFromApi && (
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

      {achievement.id !== achievement.achievementCategory?.categoryDisplayId && achievement.achievementCategory?.categoryDisplay && !data.flags.some((flag) => notPartOfCategoryDisplayFlags.includes(flag as AchievementFlags)) && (
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
        <OptionalCategoryAchievementTable achievements={categoryAchievements} language={language}>
          {(categoryAchievementTable, columnSelect) => (
            <>
              <Headline id="objectives" actions={(
                <FlexRow>
                  {Bits && <ColumnSelect table={Bits}/>}
                  {columnSelect}
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
                        case 'Item': {
                          const item = achievement.bitsItem.find(({ id }) => id === bit.id);
                          return item ? (<ItemLink item={item}/>) : <UnknownItem id={bit.id}/>;
                        }
                        case 'Skin': {
                          const skin = achievement.bitsSkin.find(({ id }) => id === bit.id);
                          return skin ? (<SkinLink skin={skin}/>) : `Unknown skin ${bit.id}`;
                        }
                        case 'Minipet': {
                          const mini = achievement.bitsMini.find(({ id }) => id === bit.id);
                          return mini ? (<MiniLink mini={mini}/>) : `Unknown minipet ${bit.id}`;
                        }
                        case 'Text':
                          return bit.text || `Unknown Objective #${index + 1}`;
                        default:
                          return `Unknown Objective #${index + 1}`;
                      }
                    }}
                  </Bits.Column>
                  {!fixedRevision && (
                    <Bits.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
                      {(_, index) => <AccountAchievementProgressRow achievement={achievement} bitId={index}/>}
                    </Bits.DynamicColumns>
                  )}
                </Bits.Table>
              )}

              {categoryAchievementTable}
            </>
          )}
        </OptionalCategoryAchievementTable>
      )}

      <Headline id="tiers">Tiers</Headline>
      <TierTable achievement={data} showAccounts={!fixedRevision}/>

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
                        <Mastery mastery={reward.region}/>
                      </FlexRow>
                    </li>
                  );
                case 'Title': {
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
                }
                case 'Item': {
                  const item = achievement.rewardsItem.find(({ id }) => id === reward.id);
                  return (
                    <li key={reward.id}>
                      {item ? (<ItemLink item={item}/>) : <UnknownItem id={reward.id}/>}
                      {reward.count && reward.count > 1 && (<span>&times;{reward.count}</span>)}
                    </li>
                  );
                }
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


      <Headline id="history">History</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small/>
            <Table.HeaderCell small>Build</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell small>Date</Table.HeaderCell>
            <Table.HeaderCell small>Actions</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {achievement.history.map((history) => (
            <tr key={history.revisionId}>
              <td style={{ paddingRight: 0 }}>{history.revisionId === revision.id && <Tip tip="Currently viewing"><Icon icon="eye"/></Tip>}</td>
              <td>{history.revision.buildId !== 0 ? (<Link href={`/build/${history.revision.buildId}`}>{history.revision.buildId}</Link>) : '-'}</td>
              <td>
                <Tooltip content={<AchievementLinkTooltip achievement={getLinkProperties(achievement)} language={language} revision={history.revisionId}/>}>
                  <Link href={`/achievement/${achievement.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </Link>
                </Tooltip>
              </td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>{history.revisionId !== revision.id && <Link href={`/achievement/${achievement.id}/${history.revisionId}`}>View</Link>}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
}
