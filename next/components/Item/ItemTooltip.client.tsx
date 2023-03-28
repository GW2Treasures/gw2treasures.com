import { FC, Fragment } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { ItemTooltip } from './ItemTooltip';
import attributeStyles from './ItemAttributes.module.css';
import { Rarity } from './Rarity';
import { Coins } from '../Format/Coins';
import { isTruthy } from '@/lib/is';
import styles from './ItemTooltip.module.css';
import { ItemLink } from './ItemLink';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip;
};

function renderAttributes(attributes: ItemTooltip['attributes']) {
  if(!attributes) {
    return;
  }

  return (
    <dl className={attributeStyles.attributes}>
      {attributes.map(({ label, value }) => (
        <Fragment key={label}>
          <dt>+{value}</dt>
          <dd>{label}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function renderBonuses(bonuses: ItemTooltip['bonuses']) {
  if(!bonuses) {
    return;
  }

  return (
    <dl className={styles.bonus}>
      {bonuses.map((bonus, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          <dt>({index}):</dt>
          <dd dangerouslySetInnerHTML={{ __html: bonus }}/>
        </Fragment>
      ))}
    </dl>
  );
}

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip }) => {
  const data = [
    tooltip.weaponStrength && (<>{tooltip.weaponStrength.label}: <FormatNumber value={tooltip.weaponStrength.min}/> – <FormatNumber value={tooltip.weaponStrength.max}/></>),
    tooltip.defense && `${tooltip.defense.label}: ${tooltip.defense.value}`,
    renderAttributes(tooltip.attributes),
    tooltip.buff && (<p className={styles.buff} dangerouslySetInnerHTML={{ __html: tooltip.buff }}/>),
    // TODO: consumable
    renderBonuses(tooltip.bonuses),
    tooltip.upgrades && tooltip.upgrades.map((upgrade) => (
      <div key={upgrade.id}>
        <ItemLink item={upgrade} icon={16} language={tooltip.language}/>
        {upgrade.buff && (<p className={styles.buff} dangerouslySetInnerHTML={{ __html: upgrade.buff }}/>)}
        {renderBonuses(upgrade.bonuses)}
      </div>
    )),
    // TODO: infusions
    // TODO: color
    // TODO: skin
    <Rarity key="rarity" rarity={tooltip.rarity.value}>{tooltip.rarity.label}</Rarity>,
    tooltip.type,
    tooltip.weightClass,
    tooltip.level && `${tooltip.level.label}: ${tooltip.level.value}`,
    // TODO: restrictions
    tooltip.description && (<p className={styles.description} dangerouslySetInnerHTML={{ __html: tooltip.description }}/>),
    ...tooltip.flags,
    tooltip.value && (<Coins value={tooltip.value}/>),
  ];

  return (
    <div>
      {data.filter(isTruthy).map((content, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <div className={styles.row} key={index}>{content}</div>;
      })}
    </div>
  );
};
