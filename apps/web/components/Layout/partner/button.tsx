import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import type { FC } from 'react';
import layoutStyles from '../Layout.module.css';
import styles from './button.module.css';
import { Trans } from '@/components/I18n/Trans';
import { PartnerLogo } from './logo';
import { Badge } from '@/components/Badge/Badge';

export const PartnerButton: FC = () => {
  const button = (
    <LinkButton href="/about#partner" appearance="menu" className={styles.button}>
      <Icon icon="story"/><span className={layoutStyles.responsive}> <Trans id="partner.button"/> <Badge>60% Sale</Badge></span>
    </LinkButton>
  );

  return (
    <DropDown button={button} hideTop={false} preferredPlacement="bottom" arrowColor="var(--color-background-light)">
      <MenuList>
        <div className={styles.dropdownDescription}>
          <PartnerLogo/>
          <Trans id="partner.info"/>
          <div style={{ marginTop: 8, color: 'var(--color-focus)', fontSize: 15, alignSelf: 'stretch' }}>Save up to 60% on expansions until Sept. 2nd.</div>
        </div>
        <LinkButton external appearance="menu" href="http://guildwars2.go2cloud.org/aff_c?offer_id=34&aff_id=758" icon="external" className={styles.buttonNoDelay}>
          <Trans id="partner.button.buy"/>
          <div className={styles.buySub}><Trans id="partner.button.buy.sub"/></div>
        </LinkButton>
        <LinkButton external appearance="menu" href="http://guildwars2.go2cloud.org/aff_c?offer_id=19&aff_id=758" icon="external">
          <Trans id="partner.button.try"/>
        </LinkButton>
      </MenuList>
    </DropDown>
  );
};
