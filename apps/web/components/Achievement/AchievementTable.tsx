import type { Achievement, Item, Language, Title } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { FC, ReactNode } from 'react';
import { ColumnSelect } from '../Table/ColumnSelect';
import { AchievementLink } from './AchievementLink';
import { AchievementPoints } from './AchievementPoints';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from './AccountAchievementProgress';
import { ItemList } from '../ItemList/ItemList';
import { ItemLink } from '../Item/ItemLink';
import type { With, WithIcon } from '@/lib/with';
import { compareLocalizedName, localizedName, type LocalizedEntity } from '@/lib/localizedName';
import { format } from 'gw2-tooltip-html';
import { Icon } from '@gw2treasures/ui';
import { FormatNumber } from '../Format/FormatNumber';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { AchievementFlags, displayedFlags } from './AchievementFlags';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Mastery } from './Mastery';

export interface AchievementTableProps {
  language: Language;
  achievements: With<WithIcon<Achievement>, {
    rewardsItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>[],
    rewardsTitle: WithIcon<Pick<Title, 'id' | keyof LocalizedEntity>>[]
  }>[];
  headline?: ReactNode;
  headlineId?: string;
  sort?: boolean;

  showMastery?: boolean;
  showRewardsTitle?: boolean;
  showRewardsItem?: boolean;

  collapsed?: boolean;
  children?: (table: ReactNode, columnSelect: ReactNode) => ReactNode
}

export const AchievementTable: FC<AchievementTableProps> = ({ language, achievements, headline, headlineId, sort = true, showMastery, showRewardsTitle, showRewardsItem, collapsed, children }) => {
  // sort achievements first by "moveToTop", then alphabetically
  const sortedAchievements = sort
    ? achievements.toSorted((a, b) => a.flags.includes('MoveToTop') ? -1 : b.flags.includes('MoveToTop') ? 1 : compareLocalizedName(language)(a, b))
    : achievements;

  const anyHasFlags = sortedAchievements.some(({ flags }) => flags.some((flag) => displayedFlags.includes(flag)));
  const anyHasMastery = sortedAchievements.some(({ mastery }) => mastery);
  const anyHasTitle = sortedAchievements.some(({ rewardsTitle }) => rewardsTitle.length > 0);
  const anyHasItem = sortedAchievements.some(({ rewardsItem }) => rewardsItem.length > 0);

  const Achievements = createDataTable(sortedAchievements, ({ id }) => id);

  const table = (
    <Achievements.Table collapsed={collapsed}>
      <Achievements.Column id="id" title="ID" sortBy="id" hidden small align="right">
        {({ id }) => id}
      </Achievements.Column>
      <Achievements.Column id="achievement" title="Achievement" sortBy={`name_${language}`}>
        {(achievement) => <AchievementLink achievement={achievement}/>}
      </Achievements.Column>
      <Achievements.Column id="flags" align="right" title="Flags" small sortBy={({ flags }) => flags.filter((flag) => displayedFlags.includes(flag)).length} hidden={!anyHasFlags}>
        {({ flags }) => <AchievementFlags flags={flags}/>}
      </Achievements.Column>
      <Achievements.Column id="mastery" title={<MasteryColumnHeader/>} sortBy="mastery" hidden={showMastery === undefined ? !anyHasMastery : !showMastery}>
        {({ mastery }) => mastery && <Mastery mastery={mastery}/>}
      </Achievements.Column>
      <Achievements.Column id="title" title={<TitleColumnHeader/>} sortBy={({ rewardsTitle }) => rewardsTitle.length} hidden={showRewardsTitle === undefined ? !anyHasTitle : !showRewardsTitle}>
        {({ rewardsTitle }) => rewardsTitle.map((title) => <span key={title.id} dangerouslySetInnerHTML={{ __html: format(localizedName(title, language)) }}/>)}
      </Achievements.Column>
      <Achievements.Column id="items" title="Items" sortBy={({ rewardsItem }) => rewardsItem.length} hidden={showRewardsItem === undefined ? !anyHasItem : !showRewardsItem}>
        {({ rewardsItem }) => rewardsItem.length > 0 && (
          <ItemList singleColumn>
            {rewardsItem.map((item) => (
              <li key={item.id}><ItemLink item={item} icon={32}/></li>
            ))}
          </ItemList>
        )}
      </Achievements.Column>
      <Achievements.Column id="unlocks" title="Unlocks" align="right" small hidden sortBy="unlocks">
        {({ unlocks }) => unlocks && <Tip tip="Data provided by gw2efficiency"><FormatNumber value={Math.round(unlocks * 1000) / 10} unit="%"/></Tip>}
      </Achievements.Column>
      <Achievements.Column id="points" align="right" title="AP" small sortBy="points">
        {({ points }) => <AchievementPoints points={points}/>}
      </Achievements.Column>
      <Achievements.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
        {(achievement) => <AccountAchievementProgressRow achievement={achievement}/>}
      </Achievements.DynamicColumns>
      <Achievements.Column id="actions" title="" small fixed>
        {({ id }) => (
          <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
            <MenuList>
              <LinkButton appearance="menu" icon="eye" href={`/achievement/${id}`}>View Achievement</LinkButton>
            </MenuList>
          </DropDown>
        )}
      </Achievements.Column>
    </Achievements.Table>
  );

  const columnSelect = (<ColumnSelect table={Achievements}/>);

  if(children) {
    return children(table, columnSelect);
  }

  return (
    <>
      {headline && headlineId && (<Headline id={headlineId} actions={columnSelect}>{headline}</Headline>)}
      {table}
    </>
  );
};

const MasteryColumnHeader = () => (<><Icon icon="mastery"/> Mastery</>);
const TitleColumnHeader = () => (<><Icon icon="title"/> Title</>);
