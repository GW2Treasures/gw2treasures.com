/* eslint-disable @next/next/no-img-element */
import type { Language } from '@gw2treasures/database';
import { ClientTraitTooltip } from './TraitTooltip.client';
import type { FC } from 'react';
import styles from './TraitTooltip.module.css';
import { format } from 'gw2-tooltip-html';
import { parseIcon } from '@/lib/parseIcon';
import type { Trait } from '@gw2api/types/data/trait';
import type { SkillFact, SkillFactTraited } from '@gw2api/types/data/skill';

export interface TraitTooltipProps {
  trait: Trait;
  language: Language;
  hideTitle?: boolean;
}

export const TraitTooltip: FC<TraitTooltipProps> = async ({ trait, language, hideTitle }) => {
  const tooltip = await createTooltip(trait, language);

  return (
    <ClientTraitTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export interface TraitTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  slot: Trait.Slot,
  description?: string,
  facts?: SkillFact[],
  traited_facts?: SkillFactTraited[],
}

// eslint-disable-next-line require-await
export async function createTooltip(trait: Trait, language: Language): Promise<TraitTooltip> {
  const icon = parseIcon(trait.icon);

  return {
    language,
    name: trait.name,
    icon,
    slot: trait.slot,
    description: trait.description,
    facts: trait.facts,
    traited_facts: trait.traited_facts,
  };
}

export interface FactProps {
  fact: SkillFact | SkillFactTraited
}

export const Fact: FC<FactProps> = ({ fact }) => {
  return (
    <div className={styles.fact}>
      {renderIcon(fact)}
      {renderText(fact)}
      {'requires_trait' in fact && (
        <div className={styles.factDescription}>Only when trait {fact.requires_trait} is equipped. {fact.overrides && `Replaces fact ${fact.overrides}.`}</div>
      )}
    </div>
  );
};

function renderIcon(fact: SkillFact) {
  switch (fact.type) {
    case 'PrefixedBuff':
      return (
        <span>
          <img src={fact.prefix?.icon} width={16} height={16} alt=""/>
          <img src={fact.icon} width={16} height={16} alt=""/>
        </span>
      );
    default:
      return (<img src={fact.icon} width={16} height={16} alt=""/>);
  }
}

function renderText(fact: SkillFact) {
  const text = renderMarkup(fact.text);

  switch (fact.type) {
    case 'AttributeAdjust':
      if (text) {
        return (<span>{text}: +{fact.value} {/*fact.target !== 'None' && */fact.target}</span>);
      }
      return (<span>{fact.target}: +{fact.value}</span>);
    case 'Buff':
    case 'PrefixedBuff': {
      const status = fact.status || fact.prefix?.status;
      const description = renderMarkup(fact.description || (fact.prefix && fact.prefix.description));
      return (
        <span>
          {fact.apply_count ? fact.apply_count + '× ' : ''}
          {status}{fact.duration > 0 ? ' (' + fact.duration + 's)' : '' }
          {description && <span>: <div className={styles.factDescription}>{description}</div></span>}
        </span>
      );
    }
    // case 'BuffConversion':
    //   return (<span>Gain {fact.target} based on a percentage of {fact.source}: {fact.percent}%</span>);
    case 'ComboField':
      return (<span>{text}: {fact.field_type}</span>);
    case 'ComboFinisher':
      return (<span>{text}: {fact.finisher_type} ({fact.percent}%)</span>);
    case 'Distance':
    case 'Radius':
      return (<span>{text}: {fact.distance}</span>);
    case 'Number':
    case 'Range':
      return (<span>{text}: {fact.value}</span>);
    case 'Percent':
      return (<span>{text}: {fact.percent}%</span>);
    case 'Recharge':
      return (<span>{text}: {fact.value}s</span>);
    case 'Time':
      return (<span>{text}: {fact.duration}s</span>);
    case 'Damage':
      return (<span>{text}: ({fact.dmg_multiplier})</span>);

    default: return text;
  }
}

function renderMarkup(text: string | undefined) {
  return text && (<span dangerouslySetInnerHTML={{ __html: format(text) }}/>);
}
