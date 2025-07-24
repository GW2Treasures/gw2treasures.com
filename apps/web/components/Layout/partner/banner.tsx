import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import type { FC } from 'react';
import styles from './banner.module.css';

export const PartnerBanner: FC = () => {
  return (
    <aside data-nosnippet="true" className={styles.banner}>
      <div className={styles.text}>
        gw2treasures.com is now an <b>ArenaNet Partner</b>! Support this website by pre-purchasing the new expansion <b>Visions of Eternity</b> via our <ExternalLink href="http://guildwars2.go2cloud.org/aff_c?offer_id=34&aff_id=758">affiliate link</ExternalLink> now!
      </div>
      <div className={styles.note}>The affiliate link works by setting a cookie in your browser, you don&apos;t need to enter a code. Please disable your adblocker to make sure the cookie is working correctly.</div>
    </aside>
  );
};
