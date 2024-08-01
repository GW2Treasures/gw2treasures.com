import type { Item, Language } from '@gw2treasures/database';
import type { Gw2Api } from 'gw2-api-types';
import type { FC } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ItemLink } from './ItemLink';
import { TradingPost } from './TradingPost';
import { encode } from 'gw2e-chat-codes';
import { localizedName } from '@/lib/localizedName';
import { getCurrentUrl } from '@/lib/url';
import { ShareButton } from '../ShareButton/ShareButton';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

interface ItemInfoboxProps {
  item: Item;
  data: Gw2Api.Item;
  language: Language;
}

function isTpTradeable(data: Gw2Api.Item) {
  const flags = ['AccountBound', 'SoulbindOnAcquire', 'MonsterOnly'];
  return data.flags.every((flag) => !flags.includes(flag));
}

export const ItemInfobox: FC<ItemInfoboxProps> = ({ item, data, language }) => {
  const isTradeable = isTpTradeable(data);
  const chatlink = encode('item', item.id);

  return (
    <div>
      <LanguageLinks language={language} link={<ItemLink icon="none" item={item}/>}/>

      <Headline id="tp" noToc>Trading Post</Headline>
      {isTradeable ? (
        <TradingPost itemId={item.id}/>
      ) : (
        <>Not tradeable on the Trading Post</>
      )}

      <Headline id="links" noToc>Links</Headline>

      <FlexRow wrap>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest&lang=${language}`} target="api">API</LinkButton>
        <LinkButton appearance="tertiary" flex icon="external" external href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(chatlink)}&go=Go`} target="wiki">Wiki</LinkButton>
        <ShareButton appearance="tertiary" flex data={{ title: localizedName(item, language), url: getCurrentUrl().toString() }}/>
      </FlexRow>

      {chatlink && (<Chatlink chatlink={chatlink}/>)}
    </div>
  );
};
