import { ChatlinkType, encodeChatlink } from '@gw2/chatlink';
import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, type ButtonProps } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import type { FC, ReactNode } from 'react';

export interface WaypointProps {
  id: number,
  title?: ReactNode,
  appearance?: ButtonProps['appearance'],
}

export const Waypoint: FC<WaypointProps> = ({ id, title, appearance = 'menu' }) => {
  const chatlink = encodeChatlink(ChatlinkType.Map, id);

  return (
    <DropDown button={<Button iconOnly={!title} appearance={appearance}><Icon icon="waypoint"/> {title}</Button>} preferredPlacement="bottom-start">
      <MenuList>
        <CopyButton appearance="menu" icon="copy" copy={chatlink}>{chatlink}</CopyButton>
      </MenuList>
    </DropDown>
  );
};
