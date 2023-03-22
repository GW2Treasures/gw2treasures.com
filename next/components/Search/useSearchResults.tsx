import { ApiSearchResponse } from 'app/api/search/route';
import { ReactNode } from 'react';
import { IconName } from '../../icons';
import IconComponent from '../../icons/Icon';
import { localizedName } from '../../lib/localizedName';
import { useJsonFetch, useStaleJsonResponse } from '../../lib/useFetch';
import { useLanguage } from '../I18n/Context';
import { ItemIcon } from '../Item/ItemIcon';
import { SkillIcon } from '../Skill/SkillIcon';

export interface SearchResults {
  id: string;
  title: ReactNode;
  results: SearchResult[]
}

export interface SearchResult {
  href: string;
  title: ReactNode;
  icon: ReactNode;
  subtitle?: ReactNode;
}

export function useSearchApiResults(searchValue: string): SearchResults[] {
  const response = useStaleJsonResponse(useJsonFetch<ApiSearchResponse>(`/api/search?q=${encodeURIComponent(searchValue)}`));
  const language = useLanguage();

  const items = response.loading ? [] : response.data.items.map((item) => ({
    title: localizedName(item, language),
    icon: item.icon && <ItemIcon icon={item.icon} size={32}/>,
    subtitle: <>{item.level > 0 && `${item.level} ▪ `} {item.rarity} {item.weight ?? ''} {(item.subtype !== 'Generic' ? item.subtype : '') || item.type}</>,
    href: `/item/${item.id}`
  }));

  const skills = response.loading ? [] : response.data.skills.map((skill) => ({
    title: localizedName(skill, language),
    icon: skill.icon && <SkillIcon icon={skill.icon} size={32}/>,
    href: `/skill/${skill.id}`,
  }));

  const skins = response.loading ? [] : response.data.skins.map((skin) => ({
    title: localizedName(skin, language),
    subtitle: <>{skin.rarity} {skin.weight} {(skin.subtype !== 'Generic' ? skin.subtype : '') || skin.type}</>,
    icon: skin.icon && <ItemIcon icon={skin.icon} size={32}/>,
    href: `/skin/${skin.id}`,
  }));

  const achievements = response.loading ? [] : response.data.achievements.map((achievement) => ({
    title: localizedName(achievement, language),
    icon: achievement.icon && <ItemIcon icon={achievement.icon} size={32}/>,
    href: `/achievement/${achievement.id}`,
    subtitle: <>{(achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Achievement')}{achievement.points > 0 && (<> ▪ {achievement.points} <IconComponent icon="achievementPoints"/></>)}</>
  }));

  const categories = response.loading ? [] : response.data.achievementCategories.map((category) => ({
    title: localizedName(category, language),
    icon: category.icon && <ItemIcon icon={category.icon} size={32}/>,
    href: `/achievement/category/${category.id}`,
    subtitle: category.achievementGroup ? localizedName(category.achievementGroup, language) : 'Category',
  }));

  const groups = response.loading ? [] : response.data.achievementGroups.map((group) => ({
    title: localizedName(group, language),
    icon: <IconComponent icon="achievement"/>,
    href: `/achievement#${group.id}`,
  }));

  const builds = response.loading ? [] : response.data.builds.map((build) => ({
    title: `Build ${build.id}`,
    icon: <IconComponent icon="builds"/>,
    href: `/build/${build.id}`,
  }));

  return [
    { id: 'items', title: 'Items', results: items },
    { id: 'skills', title: 'Skills', results: skills },
    { id: 'skins', title: 'Skins', results: skins },
    { id: 'achievements', title: 'Achievements', results: achievements },
    { id: 'achievements.categories', title: 'Achievement Categories', results: categories },
    { id: 'achievements.groups', title: 'Achievement Groups', results: groups },
    { id: 'builds', title: 'Builds', results: builds },
  ];
}

type Page = { href: string, title: string, icon: IconName };
const pages: Page[] = [
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },
  { href: '/status/api', title: 'API Status', icon: 'api-status' },

  { href: '/item', title: 'Items', icon: 'item' },
  { href: '/achievement', title: 'Achievements', icon: 'achievement' },
  { href: '/skin', title: 'Skins', icon: 'skin' },
  { href: '/profession', title: 'Professions', icon: 'profession' },
  { href: '/specialization', title: 'Specializations', icon: 'specialization' },
  { href: '/skill', title: 'Skills', icon: 'skill' },
  { href: '/mount', title: 'Mounts', icon: 'mount' },
  { href: '/wvw', title: 'Word vs. World (WvW)', icon: 'wvw' },

  { href: '/build', title: 'Builds', icon: 'builds' },

  { href: '/item/random', title: 'Random Item', icon: 'shuffle' },
  { href: '/achievement/random', title: 'Random Achievement', icon: 'shuffle' },
];

export function usePageResults(searchValue: string): SearchResults {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, icon, href }) => ({ title, href, icon: <IconComponent icon={icon}/> }));

  return { id: 'pages', title: 'Pages', results };
}
