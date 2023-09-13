import React, { FunctionComponent } from 'react';
import { Trans } from '../../I18n/Trans';
import { ClientNavigation, NavigationItem } from './Navigation.client';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (
    <ClientNavigation>
      <NavigationItem href="/item" icon="item"><Trans id="navigation.items"/></NavigationItem>
      <NavigationItem href="/achievement" icon="achievement"><Trans id="navigation.achievements"/></NavigationItem>
      <NavigationItem href="/skin" icon="skin"><Trans id="navigation.skins"/></NavigationItem>
      <NavigationItem href="/profession" icon="profession"><Trans id="navigation.professions"/></NavigationItem>
      <NavigationItem href="/specialization" icon="specialization"><Trans id="navigation.specializations"/></NavigationItem>
      <NavigationItem href="/skill" icon="skill"><Trans id="navigation.skills"/></NavigationItem>
      <NavigationItem href="/mount" icon="mount"><Trans id="navigation.mounts"/></NavigationItem>
      <NavigationItem href="/wvw" icon="wvw"><Trans id="navigation.wvw"/></NavigationItem>
      <NavigationItem href="/dev" icon="developer"><Trans id="navigation.developer"/></NavigationItem>
    </ClientNavigation>
  );
};

export default Navigation;
