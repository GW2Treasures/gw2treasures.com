import { createElement, forwardRef, ForwardRefExoticComponent, FunctionComponent, SVGProps } from 'react';
import MenuIcon from './menu.svg';
import GW2TreasuresIcon from './gw2t.svg';
import UserIcon from './user.svg';
import RevisionIcon from './revision.svg';
import SearchIcon from './search.svg';
import ChevronDownIcon from './chevronDown.svg';
import ChatlinkIcon from './chatlink.svg';
import JobsIcon from './jobs.svg';
import MountIcon from './mount.svg';
import SkillIcon from './skill.svg';
import SpecializationIcon from './specialization.svg';
import WvwIcon from './wvw.svg';
import ProfessionIcon from './profession.svg';
import SkinIcon from './skin.svg';
import AchievementIcon from './achievement.svg';
import ItemIcon from './item.svg';
import BuildsIcon from './builds.svg';
import TimeIcon from './time.svg';
import ArmorsmithIcon from './armorsmith.svg';
import ArtificerIcon from './artificer.svg';
import ChefIcon from './chef.svg';
import HuntsmanIcon from './huntsman.svg';
import JewelerIcon from './jeweler.svg';
import LeatherworkerIcon from './leatherworker.svg';
import ScribeIcon from './scribe.svg';
import TailorIcon from './tailor.svg';
import WeaponsmithIcon from './weaponsmith.svg';
import FilterIcon from './filter.svg';
import FilterActiveIcon from './filter-active.svg';
import ShuffleIcon from './shuffle.svg';
import AchievementPointsIcon from './achievement_points.svg';
import InfoIcon from './info.svg';
import LocaleIcon from './locale.svg';
import CheckmarkIcon from './checkmark.svg';
import CloseIcon from './close.svg';
import ApiStatusIcon from './api-status.svg';
import DiscordIcon from './discord.svg';
import ExternalIcon from './external.svg';
import ExternalLinkIcon from './external-link.svg';
import MasteryIcon from './mastery.svg';
import CoinsIcon from './coins.svg';
import UpgradeSlot from './upgrade-slot.svg';
import InfusionSlot from './infusion-slot.svg';
import EnrichmentSlot from './enrichment-slot.svg';
import EyeIcon from './eye.svg';
import StatusIcon from './status.svg';
import UnlockIcon from './unlock.svg';
import MoreIcon from './more.svg';

export type IconName = 'menu' | 'gw2treasures' | 'user' | 'revision' | 'search' | 'chevronDown' | 'chatlink' | 'jobs' | 'time'
 | 'mount' | 'skill' | 'specialization' | 'wvw' | 'profession' | 'skin' | 'achievement' | 'item' | 'builds'
 | 'armorsmith' | 'artificer' | 'chef' | 'huntsman' | 'jeweler' | 'leatherworker' | 'scribe' | 'tailor' | 'weaponsmith'
 | 'filter' | 'filter-active' | 'shuffle' | 'achievementPoints' | 'info' | 'locale' | 'checkmark' | 'close'
 | 'api-status' | 'discord' | 'external' | 'external-link' | 'mastery' | 'coins' | 'upgrade-slot' | 'infusion-slot' | 'enrichment-slot' | 'eye' | 'status' | 'unlock' | 'more';

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

export const Icons: Record<IconName, IconComponent> = {
  'menu': MenuIcon,
  'gw2treasures': GW2TreasuresIcon,
  'user': UserIcon,
  'revision': RevisionIcon,
  'search': SearchIcon,
  'chevronDown': ChevronDownIcon,
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
};

export type Icon = IconName | JSX.Element;

export function getIcon(icon?: Icon): JSX.Element | undefined {
  return icon
    ? ((typeof icon === 'string' && icon in Icons) ? createElement(Icons[icon as IconName]) : icon as JSX.Element)
    : undefined;
}
