import { Item, Icon, Language, Skill, Skin } from '@prisma/client';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { IconName } from '../../icons';
import IconComponent from '../../icons/Icon';
import { localizedName } from '../../lib/localizedName';
import { useJsonFetch, useStaleJsonResponse } from '../../lib/useFetch';
import { ItemIcon } from '../Item/ItemIcon';
import { SkillIcon } from '../Skill/SkillIcon';

export interface SearchResults {
  title: ReactNode;
  results: SearchResult[]
}

export interface SearchResult {
  href: string;
  title: ReactNode;
  icon: ReactNode;
  subtitle?: ReactNode;
}

export function useItemResults(searchValue: string): SearchResults {
  const response = useStaleJsonResponse(useJsonFetch<{ result: (Item & { icon?: Icon | null })[] }>(`/api/search/items?q=${encodeURIComponent(searchValue)}`));
  const { locale } = useRouter();

  const results = response.loading ? [] : response.data.result.map((item) => ({
    title: localizedName(item, locale as Language),
    icon: item.icon && <ItemIcon icon={item.icon} size={32}/>,
    subtitle: <>{item.level > 0 && `${item.level} ▪ `} {item.rarity} {item.weight ?? ''} {(item.subtype !== 'Generic' ? item.subtype : '') || item.type}</>,
    href: `/item/${item.id}`
  }));

  return { title: 'Items', results };
}

export function useSkillResults(searchValue: string): SearchResults {
  const response = useStaleJsonResponse(useJsonFetch<{ result: (Skill & { icon?: Icon | null })[] }>(`/api/search/skills?q=${encodeURIComponent(searchValue)}`));
  const { locale } = useRouter();

  const results = response.loading ? [] : response.data.result.map((skill) => ({
    title: localizedName(skill, locale as Language),
    icon: skill.icon && <SkillIcon icon={skill.icon} size={32}/>,
    href: `/skill/${skill.id}`,
  }));

  return { title: 'Skills', results };
}

export function useSkinResults(searchValue: string): SearchResults {
  const response = useStaleJsonResponse(useJsonFetch<{ result: (Skin & { icon?: Icon | null })[] }>(`/api/search/skins?q=${encodeURIComponent(searchValue)}`));
  const { locale } = useRouter();

  const results = response.loading ? [] : response.data.result.map((skin) => ({
    title: localizedName(skin, locale as Language),
    subtitle: <>{skin.rarity} {skin.weight} {(skin.subtype !== 'Generic' ? skin.subtype : '') || skin.type}</>,
    icon: skin.icon && <ItemIcon icon={skin.icon} size={32}/>,
    href: `/skin/${skin.id}`,
  }));

  return { title: 'Skins', results };
}

type Page = { href: string, title: string, icon: IconName };
const pages: Page[] = [
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },

  { href: '/item', title: 'Items', icon: 'item' },
  { href: '/achievement', title: 'Achievements', icon: 'achievement' },
  { href: '/skin', title: 'Skins', icon: 'skin' },
  { href: '/profession', title: 'Professions', icon: 'profession' },
  { href: '/specialization', title: 'Specializations', icon: 'specialization' },
  { href: '/skill', title: 'Skills', icon: 'skill' },
  { href: '/mount', title: 'Mounts', icon: 'mount' },
  { href: '/wvw', title: 'Word vs. World (WvW)', icon: 'wvw' },
];

export function usePageResults(searchValue: string): SearchResults {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, icon, href }) => ({ title, href, icon: <IconComponent icon={icon}/> }));

  return { title: 'Pages', results };
}
