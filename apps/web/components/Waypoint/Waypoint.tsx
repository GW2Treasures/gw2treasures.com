import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { encode } from 'gw2e-chat-codes';
import type { FC, ReactNode } from 'react';

export interface WaypointProps {
  id: number,
  title?: ReactNode,
}

export const Waypoint: FC<WaypointProps> = ({ id, title }) => {
  const chatlink = encode('map', id) as string;

  return (
    <DropDown button={<Button iconOnly appearance="menu"><Icon icon="waypoint"/> {title}</Button>} preferredPlacement="bottom-start">
      <MenuList>
        <CopyButton appearance="menu" icon="copy" copy={chatlink}>{chatlink}</CopyButton>
      </MenuList>
    </DropDown>
  );
};
