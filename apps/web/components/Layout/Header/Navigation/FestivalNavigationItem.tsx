import type { FC } from 'react';
import { Trans } from '../../../I18n/Trans';
import { Festival, type FestivalInfo } from '@/app/[language]/festival/festivals';
import { NavigationItem } from './NavigationItem';
import { NavigationSubItem } from './NavigationSubItem';
import { CountDown } from '@/components/Time/countdown';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';

export const FestivalNavigationItem: FC<{ festival: FestivalInfo }> = ({ festival }) => {
  switch(festival.type) {
    case Festival.Wintersday:
      return (
        <NavigationItem
          href="/festival/wintersday"
          icon="gift"
          style={{ color: 'light-dark( #00838f, #80deea)' }}
          menu={(
            <>
              <NavigationSubItem href="/festival/wintersday/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/wintersday/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/wintersday/minis" icon="mini"><Trans id="festival.wintersday.minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/wintersday/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.wintersday"/>
        </NavigationItem>
      );
    case Festival.LunarNewYear:
      return (
        <NavigationItem
          href="/festival/lunar-new-year"
          icon="lantern"
          style={{ color: 'light-dark( #db2f22, #f1c702)' }}
          menu={(
            <>
              <NavigationSubItem href="/festival/lunar-new-year/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/lunar-new-year/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/lunar-new-year/minis" icon="mini"><Trans id="festival.lunar-new-year.minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/lunar-new-year/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.lunar-new-year"/>
        </NavigationItem>
      );
    case Festival.SuperAdventureFestival:
      return (
        <NavigationItem
          href="/festival/super-adventure"
          icon="sab"
          style={{ 'color': 'light-dark( #cd00cd, #00ffff)', '--icon-color': 'light-dark(#000, #fff)' }}
          menu={(
            <>
              <NavigationSubItem href="/festival/super-adventure/box" icon="thunder-cloud"><Trans id="festival.super-adventure.sab"/></NavigationSubItem>
              <NavigationSubItem href="/festival/super-adventure/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/super-adventure/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/super-adventure/minis" icon="mini"><Trans id="minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/super-adventure/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.super-adventure"/>
        </NavigationItem>
      );
    case Festival.DragonBash:
      return (
        <NavigationItem
          href="/festival/dragon-bash"
          icon="dragon-bash"
          style={{ color: 'light-dark( #8a0009, #ff8a92)' }}
          menu={(
            <>
              <NavigationSubItem href="/festival/dragon-bash/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/dragon-bash/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/dragon-bash/minis" icon="mini"><Trans id="minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/dragon-bash/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.dragon-bash"/>
        </NavigationItem>
      );
    case Festival.FourWinds:
      return (
        <NavigationItem
          href="/festival/four-winds"
          icon="four-winds"
          style={{ color: 'light-dark( #0288d1, #81d4fa)' }}
          menu={(
            <>
              <NavigationSubItem href="/festival/four-winds/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/four-winds/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/four-winds/minis" icon="mini"><Trans id="minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/four-winds/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
              <NavigationSubItem href="/festival/four-winds/zephyrite-box" icon="vendor"><Trans id="festival.four-winds.zephyrite-box"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.four-winds"/>
        </NavigationItem>
      );
    case Festival.Halloween:
      return (
        <NavigationItem
          href="/festival/halloween"
          icon="halloween"
          style={{ color: 'light-dark( #c73000, #ffd08a)' }}
          menu={(
            <>
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <Trans id="festival.halloween.mad-king-says"/>
                <CountDown schedule={{ offset: 0, repeat: 120 }} active={<Trans id="incursive-investigation.active"/>} activeDurationMinutes={10}/>
              </div>
              <Separator/>
              <NavigationSubItem href="/festival/halloween/achievements" icon="achievement"><Trans id="navigation.achievements"/></NavigationSubItem>
              <NavigationSubItem href="/festival/halloween/skins" icon="skin"><Trans id="navigation.skins"/></NavigationSubItem>
              <NavigationSubItem href="/festival/halloween/minis" icon="mini"><Trans id="minis"/></NavigationSubItem>
              <NavigationSubItem href="/festival/halloween/wizards-vault" icon="wizards-vault"><Trans id="navigation.wizardsVault"/></NavigationSubItem>
            </>
          )}
        >
          <Trans id="festival.halloween"/>
        </NavigationItem>
      );
    default:
      return null;
  }
};
