import { getLinkProperties } from '@/lib/linkProperties';
import type { ApiSearchResponse } from 'app/[language]/api/search/route';
import { Fragment, type HTMLProps, type ReactElement, type ReactNode } from 'react';
import { localizedName } from '@/lib/localizedName';
import { useJsonFetch, useStaleJsonResponse } from '@/lib/useFetch';
import { useLanguage } from '../I18n/Context';
import { EntityIcon } from '../Entity/EntityIcon';
import { ItemLinkTooltip } from '../Item/ItemLinkTooltip';
import { Tooltip } from '../Tooltip/Tooltip';
import { AchievementLinkTooltip } from '../Achievement/AchievementLinkTooltip';
import { Icon, type IconName, type IconProp } from '@gw2treasures/ui';
import { AchievementPoints } from '../Achievement/AchievementPoints';
import { SkillLinkTooltip } from '../Skill/SkillLinkTooltip';
import type { TranslationSubset } from '@/lib/translate';
import type { translations as itemTypeTranslations, TypeTranslation } from '../Item/ItemType.translations';
import { ItemType } from '../Item/ItemType';
import type { Rarity, TraitSlot } from '@gw2treasures/database';
import { strip } from 'gw2-tooltip-html';
import type { Weight } from '@/lib/types/weight';
import { SkinLinkTooltip } from '../Skin/SkinLinkTooltip';
import type { SubType, Type } from '../Item/ItemType.types';
import { CurrencyLinkTooltip } from '../Currency/CurrencyLinkTooltip';
import { currencyCategoryById, type CurrencyCategoryName } from '@gw2treasures/static-data/currencies/categories';
import { TraitLinkTooltip } from '../Trait/TraitLinkTooltip';
import { isDefined } from '@gw2treasures/helper/is';

export interface SearchResults<Id extends string> {
  id: Id,
  results: SearchResult[],
  loading: boolean,
}

export interface SearchResult {
  href: string,
  title: ReactNode,
  icon: IconProp | null,
  subtitle?: ReactNode,
  render?: (link: ReactElement<HTMLProps<HTMLElement>>) => ReactNode,
}

export function useSearchApiResults(searchValue: string, translations: TranslationSubset<typeof itemTypeTranslations.short[0] | `rarity.${Rarity}` | `weight.${Weight}` | `currency.category.${CurrencyCategoryName}` | `trait.slot.${TraitSlot}` | `trait.tier.${1 | 2 | 3}`>) {
  const fetchResponse = useJsonFetch<ApiSearchResponse>(`/api/search?q=${encodeURIComponent(searchValue)}`);
  const response = useStaleJsonResponse(fetchResponse);
  const language = useLanguage();

  const items = response.loading ? [] : response.data.items.map<SearchResult>((item) => ({
    title: localizedName(item, language),
    icon: item.icon && <EntityIcon icon={item.icon} size={32}/>,
    subtitle: <>{item.level > 0 && `${item.level} ▪ `} {translations[`rarity.${item.rarity}`]} ▪ <ItemType type={item.type as Type} subtype={item.subtype as SubType<Type>} translations={translations as unknown as Record<TypeTranslation<Type, SubType<Type>>, string>}/> {item.weight && ' ▪ ' + translations[`weight.${item.weight as Weight}`]}</>,
    href: `/item/${item.id}`,
    render: (link) => <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)}/>} key={link.key}>{link}</Tooltip>
  }));

  const skills = response.loading ? [] : response.data.skills.map<SearchResult>((skill) => ({
    title: localizedName(skill, language),
    icon: skill.icon && <EntityIcon type="skill" icon={skill.icon} size={32}/>,
    href: `/skill/${skill.id}`,
    render: (link) => <Tooltip content={<SkillLinkTooltip skill={getLinkProperties(skill)}/>} key={link.key}>{link}</Tooltip>
  }));

  const professions = response.loading ? [] : response.data.professions.map<SearchResult>((profession) => ({
    title: localizedName(profession, language),
    subtitle:
      ['Elementalist', 'Mesmer', 'Necromancer'].includes(profession.id) ? translations['weight.Light'] :
      ['Engineer', 'Ranger', 'Thief'].includes(profession.id) ? translations['weight.Medium'] :
      translations['weight.Heavy'],
    icon: profession.icon && <EntityIcon icon={profession.icon} size={32}/>,
    href: `/professions/${profession.id}`,
  }));

  const traits = response.loading ? [] : response.data.traits.map<SearchResult>((trait) => ({
    title: localizedName(trait, language),
    subtitle: [
      trait.specialization?.profession ? localizedName(trait.specialization.profession, language) : undefined,
      trait.specialization ? localizedName(trait.specialization, language) : undefined,
      `${translations[`trait.slot.${trait.slot}`]} ${translations[`trait.tier.${trait.tier as 1 | 2 | 3}`]}${trait.slot === 'Major' ? ` ${trait.order + 1}` : ''}`
    ].filter(isDefined).join(' ▪ '),
    icon: trait.icon && <EntityIcon type={trait.slot === 'Major' ? 'trait-major' : 'trait-minor'} icon={trait.icon} size={32}/>,
    href: `/traits/${trait.id}`,
    render: (link) => <Tooltip content={<TraitLinkTooltip trait={trait}/>} key={link.key}>{link}</Tooltip>
  }));

  const skins = response.loading ? [] : response.data.skins.map<SearchResult>((skin) => ({
    title: localizedName(skin, language),
    subtitle: <>{translations[`rarity.${skin.rarity}`]} ▪ <ItemType type={skin.type as Type} subtype={skin.subtype as SubType<Type>} translations={translations as unknown as Record<TypeTranslation<Type, SubType<Type>>, string>}/>{skin.weight && ' ▪ ' + translations[`weight.${skin.weight as Weight}`]} </>,
    icon: skin.icon && <EntityIcon icon={skin.icon} size={32}/>,
    href: `/skin/${skin.id}`,
    render: (link) => <Tooltip content={<SkinLinkTooltip skin={getLinkProperties(skin)}/>} key={link.key}>{link}</Tooltip>
  }));

  const achievements = response.loading ? [] : response.data.achievements.map<SearchResult>((achievement) => ({
    title: localizedName(achievement, language),
    icon: achievement.icon && <EntityIcon icon={achievement.icon} size={32}/>,
    href: `/achievement/${achievement.id}`,
    subtitle: (
      <>
        {(achievement.achievementCategory ? localizedName(achievement.achievementCategory, language) : 'Achievement')}
        {achievement.mastery && (<> ▪ <Icon icon="mastery"/> {achievement.mastery}</>)}
        {achievement.rewardsTitle.map((title) => (<Fragment key={title.id}> ▪ <Icon icon="title"/> {strip(localizedName(title, language))}</Fragment>))}
        {achievement.points > 0 && (<> ▪ <AchievementPoints points={achievement.points}/></>)}
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
    icon: 'achievement',
    href: `/achievement#${group.id}`,
  }));

  const currencies = response.loading ? [] : response.data.currencies.map<SearchResult>((currency) => ({
    title: localizedName(currency, language),
    subtitle: currencyCategoryById[currency.id]?.map((category) => translations[`currency.category.${category}`]).join(', '),
    icon: currency.icon && <EntityIcon icon={currency.icon} size={32}/>,
    href: `/currency/${currency.id}`,
    render: (link) => <Tooltip content={<CurrencyLinkTooltip currency={getLinkProperties(currency)}/>} key={link.key}>{link}</Tooltip>
  }));

  const builds = response.loading ? [] : response.data.builds.map<SearchResult>((build) => ({
    title: `Build ${build.id}`,
    icon: 'builds',
    href: `/build/${build.id}`,
  }));

  const results = <Id extends string>(id: Id, results: SearchResult[]): SearchResults<Id> => ({ id, results, loading: fetchResponse.loading });

  return [
    results('items', items),
    results('skills', skills),
    results('professions', professions),
    results('traits', traits),
    results('skins', skins),
    results('achievements', achievements),
    results('achievements.categories', categories),
    results('achievements.groups', groups),
    results('currencies', currencies),
    results('builds', builds),
  ];
}

type Page = { href: string, title: string, icon: IconName };
const pages: Page[] = [
  // static pages
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status', title: 'Status', icon: 'status' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },
  { href: '/status/api', title: 'API Status', icon: 'api-status' },
  { href: '/status/database', title: 'Database Status', icon: 'columns' },
  { href: '/about', title: 'About', icon: 'info' },
  { href: '/about/legal', title: 'Legal Notice', icon: 'info' },
  { href: '/about/privacy', title: 'Privacy Policy', icon: 'info' },
  { href: '/review', title: 'Review Queues', icon: 'review-queue' },
  { href: 'https://discord.gg/gvx6ZSE', title: 'Discord', icon: 'discord' },
  { href: '/incursive-investigation', title: 'Incursive Investigation', icon: 'hand' },

  // main navigation
  { href: '/item', title: 'Items', icon: 'item' },
  { href: '/achievement', title: 'Achievements', icon: 'achievement' },
  { href: '/wizards-vault', title: 'Wizard\'s Vault', icon: 'wizards-vault' },
  { href: '/skill', title: 'Skills', icon: 'skill' },

  // homestead
  { href: '/homestead/nodes', title: 'Homestead: Nodes', icon: 'node' },
  { href: '/homestead/garden-plots', title: 'Homestead: Garden Plots', icon: 'garden' },
  { href: '/homestead/cats', title: 'Homestead: Cats', icon: 'cat' },
  { href: '/homestead/decorations', title: 'Homestead: Decorations', icon: 'decoration' },
  { href: '/homestead/materials', title: 'Homestead: Refined Materials', icon: 'refined-material' },
  { href: '/homestead/glyphs', title: 'Homestead: Glyphs', icon: 'glyph' },

  // wardrobe
  { href: '/skins', title: 'Skins', icon: 'skin' },
  { href: '/outfits', title: 'Outfits', icon: 'outfit' },
  { href: '/colors', title: 'Colors', icon: 'color' },
  { href: '/gliders', title: 'Gliders', icon: 'glider' },
  { href: '/minis', title: 'Minis', icon: 'mini' },

  // instances
  { href: '/fractals', title: 'Fractals', icon: 'fractals' },
  { href: '/raids', title: 'Raids', icon: 'raid' },
  { href: '/dungeons', title: 'Dungeons', icon: 'dungeon' },

  // developer
  { href: '/dev', title: 'Developer', icon: 'developer' },
  { href: '/dev/icons', title: 'Developer / Icons', icon: 'developer' },
  { href: '/dev/api', title: 'Developer / API', icon: 'developer' },
  { href: '/dev#applications', title: 'Developer / Your Applications', icon: 'developer' },

  // other (not in nav)
  { href: '/build', title: 'Builds', icon: 'builds' },
  { href: '/currency', title: 'Currencies', icon: 'coins' },

  // misc sub routes
  { href: '/item/random', title: 'Random Item', icon: 'shuffle' },
  { href: '/item/empty-containers', title: 'Empty containers', icon: 'item' },
  { href: '/achievement/random', title: 'Random Achievement', icon: 'shuffle' },
  { href: '/achievement/uncategorized', title: 'Uncategorized Achievements', icon: 'achievement' },

  // festivals
  { href: '/festival/wintersday', title: 'Wintersday', icon: 'gift' },
  { href: '/festival/lunar-new-year', title: 'Lunar New Year', icon: 'lantern' },
  { href: '/festival/super-adventure', title: 'Super Adventure Festival', icon: 'sab' },
  { href: '/festival/dragon-bash', title: 'Dragon Bash', icon: 'dragon-bash' },
  { href: '/festival/four-winds', title: 'Festival of the Four Winds', icon: 'four-winds' },
  { href: '/festival/halloween', title: 'Halloween', icon: 'halloween' },
  { href: '/bonus-event/evon-gnashblades-birthday', title: 'Evon Gnashblade’s “Birthday” celebration', icon: 'story' },
];

export function usePageResults(searchValue: string): SearchResults<'pages'> {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, icon, href }) => ({ title, href, icon }));

  return { id: 'pages', results, loading: false };
}
