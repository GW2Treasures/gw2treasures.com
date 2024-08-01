import type { FC } from 'react';
import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { encode } from 'gw2e-chat-codes';

interface RecipeDropdownProps {
  id: number;
  outputItemId?: number | null;
}

export const RecipeDropdown: FC<RecipeDropdownProps> = ({ id, outputItemId }) => {

  return (
    <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
      <MenuList>
        <CopyButton appearance="menu" icon="chatlink" copy={encode('recipe', id) || ''}>Copy chatlink</CopyButton>
        {outputItemId && (<LinkButton appearance="menu" icon="external" href={`https://gw2efficiency.com/crafting/calculator/a~0!b~1!c~0!d~1-${outputItemId}`} target="_blank" rel="noreferrer noopener">gw2efficiency</LinkButton>)}
        <LinkButton appearance="menu" icon="external" href={`https://api.guildwars2.com/v2/recipes/${id}?v=latest`} target="_blank" rel="noreferrer noopener">API</LinkButton>
      </MenuList>
    </DropDown>
  );
};
