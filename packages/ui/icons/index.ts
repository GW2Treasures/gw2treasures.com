import { createElement, FunctionComponent, SVGProps } from 'react';
import MenuIcon from './menu.svg?svgr';
import GW2TreasuresIcon from './gw2t.svg?svgr';
import UserIcon from './user.svg?svgr';
import RevisionIcon from './revision.svg?svgr';
import SearchIcon from './search.svg?svgr';
import ChatlinkIcon from './chatlink.svg?svgr';
import JobsIcon from './jobs.svg?svgr';
import MountIcon from './mount.svg?svgr';
import SkillIcon from './skill.svg?svgr';
import SpecializationIcon from './specialization.svg?svgr';
import WvwIcon from './wvw.svg?svgr';
import ProfessionIcon from './profession.svg?svgr';
import SkinIcon from './skin.svg?svgr';
import AchievementIcon from './achievement.svg?svgr';
import ItemIcon from './item.svg?svgr';
import BuildsIcon from './builds.svg?svgr';
import TimeIcon from './time.svg?svgr';
import ArmorsmithIcon from './armorsmith.svg?svgr';
import ArtificerIcon from './artificer.svg?svgr';
import ChefIcon from './chef.svg?svgr';
import HuntsmanIcon from './huntsman.svg?svgr';
import JewelerIcon from './jeweler.svg?svgr';
import LeatherworkerIcon from './leatherworker.svg?svgr';
import ScribeIcon from './scribe.svg?svgr';
import TailorIcon from './tailor.svg?svgr';
import WeaponsmithIcon from './weaponsmith.svg?svgr';
import FilterIcon from './filter.svg?svgr';
import FilterActiveIcon from './filter-active.svg?svgr';
import ShuffleIcon from './shuffle.svg?svgr';
import AchievementPointsIcon from './achievement_points.svg?svgr';
import InfoIcon from './info.svg?svgr';
import LocaleIcon from './locale.svg?svgr';
import CheckmarkIcon from './checkmark.svg?svgr';
import CloseIcon from './close.svg?svgr';
import ApiStatusIcon from './api-status.svg?svgr';
import DiscordIcon from './discord.svg?svgr';
import ExternalIcon from './external.svg?svgr';
import ExternalLinkIcon from './external-link.svg?svgr';
import MasteryIcon from './mastery.svg?svgr';
import CoinsIcon from './coins.svg?svgr';
import UpgradeSlot from './upgrade-slot.svg?svgr';
import InfusionSlot from './infusion-slot.svg?svgr';
import EnrichmentSlot from './enrichment-slot.svg?svgr';
import EyeIcon from './eye.svg?svgr';
import StatusIcon from './status.svg?svgr';
import UnlockIcon from './unlock.svg?svgr';
import MoreIcon from './more.svg?svgr';
import DeveloperIcon from './developer.svg?svgr';
import AddIcon from './add.svg?svgr';
import ReviewQueueIcon from './review-queue.svg?svgr';
import DeleteIcon from './delete.svg?svgr';
import ColumnsIcon from './columns.svg?svgr';
import ChevronDownIcon from './chevron-down.svg?svgr';
import ChevronLeftIcon from './chevron-left.svg?svgr';
import ChevronRightIcon from './chevron-right.svg?svgr';
import ChevronUpIcon from './chevron-up.svg?svgr';

export type IconName = 'menu' | 'gw2treasures' | 'user' | 'revision' | 'search' | 'chatlink' | 'jobs' | 'time'
 | 'mount' | 'skill' | 'specialization' | 'wvw' | 'profession' | 'skin' | 'achievement' | 'item' | 'builds'
 | 'armorsmith' | 'artificer' | 'chef' | 'huntsman' | 'jeweler' | 'leatherworker' | 'scribe' | 'tailor' | 'weaponsmith'
 | 'filter' | 'filter-active' | 'shuffle' | 'achievementPoints' | 'info' | 'locale' | 'checkmark' | 'close'
 | 'api-status' | 'discord' | 'external' | 'external-link' | 'mastery' | 'coins' | 'upgrade-slot' | 'infusion-slot' | 'enrichment-slot'
 | 'eye' | 'status' | 'unlock' | 'more' | 'developer' | 'add' | 'review-queue' | 'delete' | 'columns'
 | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up';

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

export const Icons: Record<IconName, IconComponent> = {
  'menu': MenuIcon,
  'gw2treasures': GW2TreasuresIcon,
  'user': UserIcon,
  'revision': RevisionIcon,
  'search': SearchIcon,
  'chatlink': ChatlinkIcon,
  'jobs': JobsIcon,
  'mount': MountIcon,
  'skill': SkillIcon,
  'specialization': SpecializationIcon,
  'wvw': WvwIcon,
  'profession': ProfessionIcon,
  'skin': SkinIcon,
  'achievement': AchievementIcon,
  'item': ItemIcon,
  'builds': BuildsIcon,
  'time': TimeIcon,
  'armorsmith': ArmorsmithIcon,
  'artificer': ArtificerIcon,
  'chef': ChefIcon,
  'huntsman': HuntsmanIcon,
  'jeweler': JewelerIcon,
  'leatherworker': LeatherworkerIcon,
  'scribe': ScribeIcon,
  'tailor': TailorIcon,
  'weaponsmith': WeaponsmithIcon,
  'filter': FilterIcon,
  'filter-active': FilterActiveIcon,
  'shuffle': ShuffleIcon,
  'achievementPoints': AchievementPointsIcon,
  'info': InfoIcon,
  'locale': LocaleIcon,
  'checkmark': CheckmarkIcon,
  'close': CloseIcon,
  'api-status': ApiStatusIcon,
  'discord': DiscordIcon,
  'external': ExternalIcon,
  'external-link': ExternalLinkIcon,
  'mastery': MasteryIcon,
  'coins': CoinsIcon,
  'upgrade-slot': UpgradeSlot,
  'infusion-slot': InfusionSlot,
  'enrichment-slot': EnrichmentSlot,
  'eye': EyeIcon,
  'status': StatusIcon,
  'unlock': UnlockIcon,
  'more': MoreIcon,
  'developer': DeveloperIcon,
  'add': AddIcon,
  'review-queue': ReviewQueueIcon,
  'delete': DeleteIcon,
  'columns': ColumnsIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
};

export type IconProp = IconName | JSX.Element;

export function getIcon(icon?: IconProp): JSX.Element | undefined {
  return icon
    ? ((typeof icon === 'string' && icon in Icons) ? createElement(Icons[icon as IconName]) : icon as JSX.Element)
    : undefined;
}

// re-export icon component
export * from './Icon';
