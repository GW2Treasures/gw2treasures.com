import { Item, Language } from '@gw2treasures/database';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { ItemLink } from './ItemLink';
import { TradingPost } from './TradingPost';
import { encode } from 'gw2e-chat-codes';

interface ItemInfoboxProps {
  item: Item;
  data: Gw2Api.Item;
  language: Language;
};

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

      <ExternalLink href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest&lang=${language}`} target="api">API</ExternalLink>
      {' ▪ '}
      <ExternalLink href={`https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encodeURIComponent(chatlink)}&go=Go`} target="wiki">Wiki</ExternalLink>

      {chatlink && (<Chatlink chatlink={chatlink}/>)}
    </div>
  );
};
