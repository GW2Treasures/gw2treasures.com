/* eslint-disable @next/next/no-img-element */
import type { SkillFact } from '@gw2api/types/data/skill';
import type { FC } from 'react';
import { TraitLink } from '../Trait/TraitLink';
import type { SkillFactTraitedTooltip } from './SkillTooltip';
import styles from './SkillTooltip.module.css';
import { Gw2Markup } from '../Format/Gw2Markup';

export interface FactProps {
  fact: SkillFact | SkillFactTraitedTooltip,
}

export const Fact: FC<FactProps> = ({ fact }) => {
  return (
    <div className={styles.fact}>
      {renderIcon(fact)}
      {renderText(fact)}
      {'requires_trait' in fact && (
        <div className={styles.factDescription}>Only when trait {fact.trait ? <TraitLink trait={fact.trait} icon="none"/> : `[unknown trait ${fact.requires_trait}]`} is equipped. {fact.overrides && `Replaces fact ${fact.overrides}.`}</div>
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
  const text = <Gw2Markup markup={fact.text}/>;

  switch (fact.type) {
    case 'AttributeAdjust':
      if (text) {
        return (<span>{text}: +{fact.value} {/*fact.target !== 'None' && */fact.target}</span>);
      }
      return (<span>{fact.target}: +{fact.value}</span>);
    case 'Buff':
    case 'PrefixedBuff': {
      const status = fact.status || fact.prefix?.status;
      const description = fact.description || (fact.prefix && fact.prefix.description);
      return (
        <span>
          {fact.apply_count ? fact.apply_count + '× ' : ''}
          {status}{fact.duration > 0 ? ' (' + fact.duration + 's)' : '' }
          {description && <span>: <div className={styles.factDescription}><Gw2Markup markup={description}/></div></span>}
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

