import { Item, Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import Icon from '../../icons/Icon';
import { Headline } from '../Headline/Headline';
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

      <div style={{ display: 'flex', gap: 12, margin: '8px 0', alignItems: 'center', borderRadius: 0, border: '1px solid var(--color-border)', paddingLeft: 12 }}>
        <Icon icon="chatlink"/>
        <input readOnly value={data.chat_link} style={{ margin: 0, padding: '7px 12px 9px 12px', border: 0, background: 'inherit', color: 'inherit', flex: 1, font: 'inherit', borderLeft: '1px solid var(--color-border)' }}/>
      </div>
    </div>
  );
};
