import { Item, Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import Icon from '../../icons/Icon';
import { Headline } from '../Headline/Headline';
import { Chatlink } from '../Infobox/Chatlink';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ExternalLink } from '../Link/ExternalLink';
import { ItemLink } from './ItemLink';
import { TradingPost } from './TradingPost';

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

      <Chatlink chatlink={data.chat_link}/>
    </div>
  );
};
