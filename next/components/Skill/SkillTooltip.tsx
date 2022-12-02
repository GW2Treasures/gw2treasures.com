/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import { Gw2Api } from 'gw2-api-types';
import { format } from 'gw2-tooltip-html';
import styles from './SkillTooltip.module.css';
import { Separator } from '../Layout/Separator';

export interface SkillTooltipProps {
  data: Gw2Api.Skill;
}

export const SkillTooltip: FC<SkillTooltipProps> = ({ data }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: format(data.description) }} className={styles.description}/>
      {data.facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
      {data.facts && data.traited_facts && data.facts?.length > 0 && data.traited_facts?.length > 0 && (<Separator/>)}
      {data.traited_facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
    </div>
  );
};

type ArrayType<T> = T extends Array<any> ? T[0] : never;

export interface FactProps {
  fact: ArrayType<Gw2Api.Skill['facts']> | ArrayType<Gw2Api.Skill['traited_facts']>
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

function renderIcon(fact: FactProps['fact']) {
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

function renderText(fact: FactProps['fact']) {
  const text = renderMarkup(fact.text);

  switch (fact.type) {
    case 'AttributeAdjust':
      if (text) {
        return (<span>{text}: +{fact.value} {/*fact.target !== 'None' && */fact.target}</span>);
      }
      return (<span>{fact.target}: +{fact.value}</span>);
    case 'Buff':
    case 'PrefixedBuff':
      const status = fact.status || fact.prefix?.status;
      const description = renderMarkup(fact.description || (fact.prefix && fact.prefix.description));
      return (
        <span>
          {fact.apply_count ? fact.apply_count + '× ' : ''}
          {status}{fact.duration > 0 ? ' (' + fact.duration + 's)' : '' }
          {description && <span>: <div className={styles.factDescription}>{description}</div></span>}
        </span>
      );
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
};

function renderMarkup(text: string | undefined) {
    return text && (<span dangerouslySetInnerHTML={{ __html: format(text) }}/>);
};
