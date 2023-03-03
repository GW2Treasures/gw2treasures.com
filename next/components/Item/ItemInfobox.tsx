import { Item } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { FC } from 'react';
import Icon from '../../icons/Icon';
import { Headline } from '../Headline/Headline';
import { getLanguage } from '../I18n/getLanguage';
import { LanguageLinks } from '../Infobox/LanguageLinks';
import { ItemLink } from './ItemLink';
import { TradingPost } from './TradingPost';

interface ItemInfoboxProps {
  item: Item;
  data: Gw2Api.Item;
};

function isTpTradeable(data: Gw2Api.Item) {
  const flags = ['AccountBound', 'SoulbindOnAcquire', 'MonsterOnly'];
  return data.flags.every((flag) => !flags.includes(flag));
}

export const ItemInfobox: FC<ItemInfoboxProps> = ({ item, data }) => {
  const language = getLanguage();
  const isTradeable = isTpTradeable(data);

  return (
    <div>
      <LanguageLinks link={<ItemLink icon="none" item={item}/>}/>

      <Headline id="tp" noToc>Trading Post</Headline>
      {isTradeable ? (
        <TradingPost itemId={item.id}/>
      ) : (
        <>Not tradeable on the Trading Post</>
      )}

      <Headline id="links" noToc>Links</Headline>

      <a href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest&lang=${language}`} target="api" rel="noreferrer noopener">API</a>

      <div style={{ display: 'flex', gap: 12, margin: '8px 0', alignItems: 'center', borderRadius: 0, border: '1px solid var(--color-border)', paddingLeft: 12 }}>
        <Icon icon="chatlink"/>
        <input readOnly value={data.chat_link} style={{ margin: 0, padding: '7px 12px 9px 12px', border: 0, background: '#fff', flex: 1, font: 'inherit', borderLeft: '1px solid var(--color-border)' }}/>
      </div>
    </div>
  );
};
