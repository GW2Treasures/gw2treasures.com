import { FC, Fragment } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { ItemTooltip } from './ItemTooltip';
import attributeStyles from './ItemAttributes.module.css';
import { Rarity } from './Rarity';
import { Coins } from '../Format/Coins';
import { isTruthy } from '@/lib/is';
import styles from './ItemTooltip.module.css';
import { ItemLink } from './ItemLink';
import Icon from 'icons/Icon';
import { ItemIcon } from './ItemIcon';

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

function formatDuration(ms: number) {
  const conversion: [number, string][] = [
    [1000, 's'],
    [60, 'm'],
    [60, 'h'],
    [24, 'd'],
  ];

  const [value, unit] = conversion.reduce<[number, string, boolean]>(([value, unit, done], [conversion, conversedUnit]) => {
    return !done && value >= conversion ? [value / conversion, conversedUnit, false] : [value, unit, true];
  }, [ms, 'ms', false]);

  return (
    <><FormatNumber value={value}/>{unit}</>
  );
};

function renderConsumable(consumable: ItemTooltip['consumable']) {
  if(!consumable) {
    return;
  }

  return (
    <>
      <div className={styles.row}>Double-click to consume.</div>
      {(consumable.name || consumable.duration_ms || consumable.icon || consumable.apply_count || consumable.description) && (
        <div className={styles.consumable}>
          {consumable.icon && <ItemIcon icon={consumable.icon} size={32}/>}
          <div className={styles.consumableDetails}>
            {(consumable.name || consumable.duration_ms) && (
              <div className={styles.consumableName}>
                {consumable.apply_count && consumable.apply_count > 1 && `${consumable.apply_count}× `}
                {consumable.name && consumable.duration_ms
                  ? <>{consumable.name} ({formatDuration(consumable.duration_ms)}):</>
                  : consumable.name ? consumable.name : consumable.duration_ms && <>Duration: {formatDuration(consumable.duration_ms)}</>}
              </div>
            )}
            {consumable.description && (<p className={styles.buff} dangerouslySetInnerHTML={{ __html: consumable.description }}/>)}
          </div>
        </div>
      )}
    </>
  );
}

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip }) => {
  const data = [
    tooltip.weaponStrength && (<>{tooltip.weaponStrength.label}: <FormatNumber value={tooltip.weaponStrength.min}/> – <FormatNumber value={tooltip.weaponStrength.max}/></>),
    tooltip.defense && `${tooltip.defense.label}: ${tooltip.defense.value}`,
    renderAttributes(tooltip.attributes),
    tooltip.buff && (<p className={styles.buff} dangerouslySetInnerHTML={{ __html: tooltip.buff }}/>),
    renderConsumable(tooltip.consumable),
    renderBonuses(tooltip.bonuses),
    tooltip.upgrades && tooltip.upgrades.map((upgrade, slot) => upgrade === null ? (
      // eslint-disable-next-line react/no-array-index-key
      <div key={slot} className={styles.row}><Icon icon="upgrade-slot"/> Unused Upgrade Slot</div>
    ) : (
      // eslint-disable-next-line react/no-array-index-key
      <div key={slot} className={styles.row}>
        <ItemLink item={upgrade} icon={16} language={tooltip.language}/>
        {renderAttributes(upgrade.attributes)}
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
