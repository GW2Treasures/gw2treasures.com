import { FC, Fragment } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { ItemTooltip } from './ItemTooltip';
import attributeStyles from './ItemAttributes.module.css';
import { Rarity } from './Rarity';
import { Coins } from '../Format/Coins';
import { isTruthy } from '@/lib/is';
import styles from './ItemTooltip.module.css';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip;
};

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip }) => {
  const data = [
    tooltip.weaponStrength && (<>{tooltip.weaponStrength.label}: <FormatNumber value={tooltip.weaponStrength.min}/> – <FormatNumber value={tooltip.weaponStrength.max}/></>),
    tooltip.defense && `${tooltip.defense.label}: ${tooltip.defense.value}`,
    tooltip.attributes && (
      <dl className={attributeStyles.attributes}>
        {tooltip.attributes.map(({ label, value }) => (
          <Fragment key={label}>
            <dt>+{value}</dt>
            <dd>{label}</dd>
          </Fragment>
        ))}
      </dl>
    ),
    // TODO: consumable
    tooltip.bonuses && tooltip.bonuses.map((bonus, index) => (<div key={bonus}>({index}): {bonus}</div>)),
    // TODO: upgrade slot
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
