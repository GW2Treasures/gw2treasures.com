import type { FC } from 'react';
import { Trans } from '../../../I18n/Trans';
import styles from './Navigation.module.css';
import { HorizontalOverflowContainer } from '../../HorizontalOverflowContainer';
import type { Language } from '@gw2treasures/database';
import { Composite } from '@gw2treasures/ui/components/Focus/Composite';
import { WizardsVaultNewSeasonBadge } from './WizardsVaultNewSeasonBadge';
import { getActiveFestival } from '@/app/[language]/festival/festivals';
import { BonusEvent, getActiveBonusEvent } from '@/app/[language]/bonus-event/bonus-events';
import { Badge } from '@/components/Badge/Badge';
import { NavigationItem } from './NavigationItem';
import { NavigationDelayGroup } from './NavigationDelayGroup';
import { translate } from '@/lib/translate';
import { NavigationSubItem } from './NavigationSubItem';
import { FestivalNavigationItem } from './FestivalNavigationItem';

interface NavigationProps {
  language: Language,
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  const festival = getActiveFestival();
  const bonusEvent = getActiveBonusEvent();

  return (
    <NavigationDelayGroup>
      <HorizontalOverflowContainer>
        <Composite role="menubar" aria-label={translate('navigation.label', language)} orientation="horizontal" render={<ul className={styles.navigation}/>}>
          {festival && (<FestivalNavigationItem festival={festival}/>)}
          {!festival && bonusEvent?.type === BonusEvent.FractalIncursion && (<NavigationItem href="/incursive-investigation" icon="hand" style={{ color: 'light-dark(#663399, #debeff)' }}><Trans language={language} id="incursive-investigation"/></NavigationItem>)}
          <NavigationItem href="/item" icon="item"><Trans language={language} id="navigation.items"/></NavigationItem>
          <NavigationItem href="/achievement" icon="achievement"><Trans language={language} id="navigation.achievements"/></NavigationItem>
          <NavigationItem href="/wizards-vault" icon="wizards-vault"><Trans language={language} id="navigation.wizardsVault"/><WizardsVaultNewSeasonBadge/></NavigationItem>
          <NavigationItem
            href="/homestead/nodes"
            icon="homestead"
            menu={(
              <>
                <NavigationSubItem href="/homestead/nodes" icon="node"><Trans language={language} id="homestead.nodes"/></NavigationSubItem>
                <NavigationSubItem href="/homestead/garden-plots" icon="garden"><Trans language={language} id="homestead.garden-plots"/></NavigationSubItem>
                <NavigationSubItem href="/homestead/cats" icon="cat"><Trans language={language} id="homestead.cats"/></NavigationSubItem>
                <NavigationSubItem href="/homestead/decorations" icon="decoration"><Trans language={language} id="homestead.decorations"/></NavigationSubItem>
                <NavigationSubItem href="/homestead/materials" icon="refined-material"><Trans language={language} id="homestead.materials"/></NavigationSubItem>
                <NavigationSubItem href="/homestead/glyphs" icon="glyph"><Trans language={language} id="homestead.glyphs"/></NavigationSubItem>
              </>
            )}
          >
            <Trans language={language} id="navigation.homestead"/>
          </NavigationItem>
          <NavigationItem
            href="/skins"
            icon="wardrobe"
            menu={(
              <>
                <NavigationSubItem href="/skins" icon="skin"><Trans language={language} id="navigation.skins"/></NavigationSubItem>
                <NavigationSubItem href="/outfits" icon="outfit"><Trans language={language} id="outfits"/></NavigationSubItem>
                <NavigationSubItem href="/colors" icon="color"><Trans language={language} id="colors"/></NavigationSubItem>
                <NavigationSubItem href="/gliders" icon="glider"><Trans language={language} id="gliders"/></NavigationSubItem>
                <NavigationSubItem href="/minis" icon="mini"><Trans language={language} id="minis"/></NavigationSubItem>
                <NavigationSubItem href="/legendary/weapons" icon="legendary"><Trans language={language} id="legendary-armory"/></NavigationSubItem>
              </>
            )}
          >
            <Trans language={language} id="navigation.wardrobe"/>
          </NavigationItem>
          <NavigationItem
            href="/professions"
            icon="profession"
            menu={(
              <>
                <NavigationSubItem href="/professions" icon="profession"><Trans language={language} id="navigation.professions"/></NavigationSubItem>
                <NavigationSubItem href="/skills" icon="skill"><Trans language={language} id="navigation.skills"/></NavigationSubItem>
              </>
            )}
          >
            <Trans language={language} id="navigation.professions"/>
          </NavigationItem>
          <NavigationItem
            href="/fractals"
            icon="fractals"
            menu={(
              <>
                <NavigationSubItem href="/fractals" icon="fractals"><Trans language={language} id="fractals"/></NavigationSubItem>
                <NavigationSubItem href="/raids" icon="raid"><Trans language={language} id="raids"/></NavigationSubItem>
                <NavigationSubItem href="/dungeons" icon="dungeon"><Trans language={language} id="dungeons"/></NavigationSubItem>
              </>
            )}
          >
            <Trans language={language} id="navigation.instances"/>{bonusEvent?.type === BonusEvent.FractalRush && (<Badge>Fractal Rush</Badge>)}
          </NavigationItem>
          <NavigationItem href="/dev" icon="developer"><Trans language={language} id="navigation.developer"/></NavigationItem>
        </Composite>
      </HorizontalOverflowContainer>
    </NavigationDelayGroup>
  );
};

export default Navigation;
