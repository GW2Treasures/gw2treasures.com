import { getLinkProperties } from '@/lib/linkProperties';
import { ApiSearchResponse } from 'app/[language]/api/search/route';
import { ReactElement, ReactNode } from 'react';
import { localizedName } from '../../lib/localizedName';
import { useJsonFetch, useStaleJsonResponse } from '../../lib/useFetch';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLinkTooltip } from '../Item/ItemLinkTooltip';
import { Tooltip } from '../Tooltip/Tooltip';
import { AchievementLinkTooltip } from '../Achievement/AchievementLinkTooltip';
import { Icon, IconName } from '@gw2treasures/ui';

export interface SearchResults {
  id: string;
  title: ReactNode;
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

  const skills = response.loading ? [] : response.data.skills.map((skill) => ({
    title: localizedName(skill, language),
    icon: skill.icon && <EntityIcon type="skill" icon={skill.icon} size={32}/>,
    href: `/skill/${skill.id}`,
  }));

  const skins = response.loading ? [] : response.data.skins.map((skin) => ({
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
        {achievement.points > 0 && (<> ▪ {achievement.points} <Icon icon="achievement_points"/></>)}
        {achievement.mastery && (<> ▪ <Icon icon="mastery"/> {achievement.mastery}</>)}
      </>
    ),
    render: (link) => <Tooltip content={<AchievementLinkTooltip achievement={getLinkProperties(achievement)}/>} key={link.key}>{link}</Tooltip>
  }));

  const categories = response.loading ? [] : response.data.achievementCategories.map((category) => ({
    title: localizedName(category, language),
    icon: category.icon && <EntityIcon icon={category.icon} size={32}/>,
    href: `/achievement/category/${category.id}`,
    subtitle: category.achievementGroup ? localizedName(category.achievementGroup, language) : 'Category',
  }));

  const groups = response.loading ? [] : response.data.achievementGroups.map((group) => ({
    title: localizedName(group, language),
    icon: <Icon icon="achievement"/>,
    href: `/achievement#${group.id}`,
  }));

  const builds = response.loading ? [] : response.data.builds.map((build) => ({
    title: `Build ${build.id}`,
    icon: <Icon icon="builds"/>,
    href: `/build/${build.id}`,
  }));

  return [
    { id: 'items', title: 'Items', results: items, loading: fetchResponse.loading },
    { id: 'skills', title: 'Skills', results: skills, loading: fetchResponse.loading },
    { id: 'skins', title: 'Skins', results: skins, loading: fetchResponse.loading },
    { id: 'achievements', title: 'Achievements', results: achievements, loading: fetchResponse.loading },
    { id: 'achievements.categories', title: 'Achievement Categories', results: categories, loading: fetchResponse.loading },
    { id: 'achievements.groups', title: 'Achievement Groups', results: groups, loading: fetchResponse.loading },
    { id: 'builds', title: 'Builds', results: builds, loading: fetchResponse.loading },
  ];
}

type Page = { href: string, title: string, icon: IconName };
const pages: Page[] = [
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status', title: 'Status', icon: 'status' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },
  { href: '/status/api', title: 'API Status', icon: 'api-status' },
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

  return { id: 'pages', title: 'Pages', results, loading: false };
}
