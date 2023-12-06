import { getLinkProperties } from '@/lib/linkProperties';
import type { ApiSearchResponse } from 'app/[language]/api/search/route';
import type { ReactElement, ReactNode } from 'react';
import { localizedName } from '@/lib/localizedName';
import { useJsonFetch, useStaleJsonResponse } from '@/lib/useFetch';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLinkTooltip } from '../Item/ItemLinkTooltip';
import { Tooltip } from '../Tooltip/Tooltip';
import { AchievementLinkTooltip } from '../Achievement/AchievementLinkTooltip';
import { Icon, type IconName } from '@gw2treasures/ui';
import { AchievementPoints } from '../Achievement/AchievementPoints';
import { SkillLinkTooltip } from '../Skill/SkillLinkTooltip';

export interface SearchResults {
  id: string;
  results: SearchResult[];
  loading: boolean;
}

export interface SearchResult {
  href: string;
  title: ReactNode;
  icon: ReactNode;
  subtitle?: ReactNode;
  render?: (link: ReactElement) => ReactNode;
}

export function useSearchApiResults(searchValue: string): SearchResults[] {
  const fetchResponse = useJsonFetch<ApiSearchResponse>(`/api/search?q=${encodeURIComponent(searchValue)}`);
  const response = useStaleJsonResponse(fetchResponse);
  const language = useLanguage();

  const items = response.loading ? [] : response.data.items.map<SearchResult>((item) => ({
    title: localizedName(item, language),
    icon: item.icon && <EntityIcon icon={item.icon} size={32}/>,
    subtitle: <>{item.level > 0 && `${item.level} ▪ `} {item.rarity} {item.weight ?? ''} {(item.subtype !== 'Generic' ? item.subtype : '') || item.type}</>,
    href: `/item/${item.id}`,
    render: (link) => <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)}/>} key={link.key}>{link}</Tooltip>
  }));

  const skills = response.loading ? [] : response.data.skills.map<SearchResult>((skill) => ({
    title: localizedName(skill, language),
    icon: skill.icon && <EntityIcon type="skill" icon={skill.icon} size={32}/>,
    href: `/skill/${skill.id}`,
    render: (link) => <Tooltip content={<SkillLinkTooltip skill={getLinkProperties(skill)}/>} key={link.key}>{link}</Tooltip>
  }));

  const skins = response.loading ? [] : response.data.skins.map<SearchResult>((skin) => ({
    title: localizedName(skin, language),
    subtitle: <>{skin.rarity} {skin.weight} {(skin.subtype !== 'Generic' ? skin.subtype : '') || skin.type}</>,
    icon: skin.icon && <EntityIcon icon={skin.icon} size={32}/>,
    href: `/skin/${skin.id}`,
  }));

  const achievements = response.loading ? [] : response.data.achievements.map<SearchResult>((achievement) => ({
    title: localizedName(achievement, language),
    icon: achievement.icon && <EntityIcon icon={achievement.icon} size={32}/>,
    href: `/achievement/${achievement.id}`,
    subtitle: (
      <>
        {(achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Achievement')}
        {achievement.points > 0 && (<> ▪ <AchievementPoints points={achievement.points}/></>)}
        {achievement.mastery && (<> ▪ <Icon icon="mastery"/> {achievement.mastery}</>)}
        {achievement.rewardsTitleIds.length > 0 && (<> ▪ <Icon icon="title"/></>)}
      </>
    ),
    render: (link) => <Tooltip content={<AchievementLinkTooltip achievement={getLinkProperties(achievement)}/>} key={link.key}>{link}</Tooltip>
  }));

  const categories = response.loading ? [] : response.data.achievementCategories.map<SearchResult>((category) => ({
    title: localizedName(category, language),
    icon: category.icon && <EntityIcon icon={category.icon} size={32}/>,
    href: `/achievement/category/${category.id}`,
    subtitle: category.achievementGroup ? localizedName(category.achievementGroup, language) : 'Category',
  }));

  const groups = response.loading ? [] : response.data.achievementGroups.map<SearchResult>((group) => ({
    title: localizedName(group, language),
    icon: <Icon icon="achievement"/>,
    href: `/achievement#${group.id}`,
  }));

  const builds = response.loading ? [] : response.data.builds.map<SearchResult>((build) => ({
    title: `Build ${build.id}`,
    icon: <Icon icon="builds"/>,
    href: `/build/${build.id}`,
  }));

  return [
    { id: 'items', results: items, loading: fetchResponse.loading },
    { id: 'skills', results: skills, loading: fetchResponse.loading },
    { id: 'skins', results: skins, loading: fetchResponse.loading },
    { id: 'achievements', results: achievements, loading: fetchResponse.loading },
    { id: 'achievements.categories', results: categories, loading: fetchResponse.loading },
    { id: 'achievements.groups', results: groups, loading: fetchResponse.loading },
    { id: 'builds', results: builds, loading: fetchResponse.loading },
  ];
}

type Page = { href: string, title: string, icon: IconName };
const pages: Page[] = [
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status', title: 'Status', icon: 'status' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },
  { href: '/status/api', title: 'API Status', icon: 'api-status' },
  { href: '/status/database', title: 'Database Status', icon: 'columns' },
  { href: '/about', title: 'About', icon: 'info' },
  { href: '/review', title: 'Review Queues', icon: 'review-queue' },
  { href: 'https://discord.gg/gvx6ZSE', title: 'Discord', icon: 'discord' },

  { href: '/item', title: 'Items', icon: 'item' },
  { href: '/achievement', title: 'Achievements', icon: 'achievement' },
  { href: '/skin', title: 'Skins', icon: 'skin' },
  { href: '/profession', title: 'Professions', icon: 'profession' },
  { href: '/specialization', title: 'Specializations', icon: 'specialization' },
  { href: '/skill', title: 'Skills', icon: 'skill' },
  { href: '/mount', title: 'Mounts', icon: 'mount' },
  { href: '/wvw', title: 'Word vs. World (WvW)', icon: 'wvw' },

  { href: '/dev', title: 'Developer', icon: 'developer' },
  { href: '/dev/icons', title: 'Developer / Icons', icon: 'developer' },
  { href: '/dev/api', title: 'Developer / API', icon: 'developer' },
  { href: '/dev#applications', title: 'Developer / Your Applications', icon: 'developer' },

  { href: '/build', title: 'Builds', icon: 'builds' },
  { href: '/currency', title: 'Currencies', icon: 'coins' },
  { href: '/color', title: 'Colors', icon: 'color' },

  { href: '/item/random', title: 'Random Item', icon: 'shuffle' },
  { href: '/item/empty-containers', title: 'Empty containers', icon: 'item' },
  { href: '/achievement/random', title: 'Random Achievement', icon: 'shuffle' },
  { href: '/achievement/uncategorized', title: 'Uncategorized Achievements', icon: 'achievement' },
];

export function usePageResults(searchValue: string): SearchResults {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, icon, href }) => ({ title, href, icon: <Icon icon={icon}/> }));

  return { id: 'pages', results, loading: false };
}
