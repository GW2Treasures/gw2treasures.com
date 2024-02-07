import { type FC, Fragment, type ReactNode } from 'react';
import { FormatNumber } from '../Format/FormatNumber';
import { ItemTooltip } from './ItemTooltip';
import { Rarity } from './Rarity';
import { Coins } from '../Format/Coins';
import { isTruthy } from '@gw2treasures/helper/is';
import styles from './ItemTooltip.module.css';
import { ItemLink } from './ItemLink';
import { Icon } from '@gw2treasures/ui';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { DyeColor } from '../Color/DyeColor';
import { hexToRgb } from '../Color/hex-to-rgb';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip;
  hideTitle?: boolean;
};

function renderAttributes(attributes: ItemTooltip['attributes']) {
  if(!attributes) {
    return;
  }

  return (
    <dl className={styles.attributes}>
      {attributes.map(({ label, value }) => (
        <Fragment key={label}>
          <dt className={styles.value}>+{value}</dt>
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
    <dl className={styles.attributes}>
      {bonuses.map((bonus, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          <dt className={styles.bonus}>({index}):</dt>
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
          {consumable.icon && <EntityIcon icon={consumable.icon} size={32}/>}
          <div className={styles.consumableDetails}>
            {(consumable.name || consumable.duration_ms) && (
              <div className={styles.consumableName}>
                {consumable.apply_count !== undefined && consumable.apply_count > 1 && `${consumable.apply_count}× `}
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

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip, hideTitle = false }) => {
  const data: ReactNode[] = [
    tooltip.weaponStrength && (<>{tooltip.weaponStrength.label}: <FormatNumber value={tooltip.weaponStrength.min} className={styles.value}/> – <FormatNumber value={tooltip.weaponStrength.max} className={styles.value}/></>),
    tooltip.defense && <>{tooltip.defense.label}: <FormatNumber value={tooltip.defense.value} className={styles.value}/></>,
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
    tooltip.infusions && tooltip.infusions.map((infusion, slot) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={slot} className={styles.row}>
        {infusion.item
          ? (
            <>
              <ItemLink item={infusion.item} icon={16} language={tooltip.language}/>
              {renderAttributes(infusion.item.attributes)}
              {infusion.item.buff && (<p className={styles.buff} dangerouslySetInnerHTML={{ __html: infusion.item.buff }}/>)}
              {renderBonuses(infusion.item.bonuses)}
            </>
          )
          : <><Icon icon={infusion.type === 'Infusion' ? 'infusion-slot' : 'enrichment-slot'}/> {infusion.unused}</>
        }
      </div>
    )),
    tooltip.unlocksColor && (
      <div>
        <div className={styles.consumableName}>
          {tooltip.unlocksColor.name}
        </div>
        <div className={styles.unlocksColor}>
          <Tip preferredPlacement="bottom" tip="Cloth"><DyeColor color={hexToRgb(tooltip.unlocksColor.colors.cloth)}/></Tip>
          <Tip preferredPlacement="bottom" tip="Leather"><DyeColor color={hexToRgb(tooltip.unlocksColor.colors.leather)}/></Tip>
          <Tip preferredPlacement="bottom" tip="Metal"><DyeColor color={hexToRgb(tooltip.unlocksColor.colors.metal)}/></Tip>
        </div>
      </div>
    ),
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
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}

      {data.filter(isTruthy).map((content, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <div className={styles.row} key={index}>{content}</div>;
      })}
    </div>
  );
};
