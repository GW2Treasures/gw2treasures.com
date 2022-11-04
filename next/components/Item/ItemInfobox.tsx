import { Item } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { Api } from '../../lib/apiTypes';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';
import { Headline } from '../Headline/Headline';
import styles from './ItemInfobox.module.css';
import { ItemLink } from './ItemLink';

interface ItemInfoboxProps {
  item: Item;
  data: Api.Item;
};

function isTpTradeable(data: Api.Item) {
  const flags = ['AccountBound', 'SoulbindOnAcquire', 'MonsterOnly'];
  return data.flags.every((flag) => !flags.includes(flag));
}

export const ItemInfobox: FC<ItemInfoboxProps> = ({ item, data }) => {
  const router = useRouter();
  const isTradeable = isTpTradeable(data);
  const [tpData, setTpData] = useState<Api.Commerce.Price>();

  useEffect(() => {
    fetch(`https://api.guildwars2.com/v2/commerce/prices/${item.id}`).then((r) => r.json()).then((prices) => {
      setTpData(prices);
    });
  }, [item]);

  return (
    <div>
      <div className={styles.languages}>
        {router.locale !== 'de' && (<><div className={styles.lang}>DE</div><ItemLink icon="none" item={item} locale="de"/></>)}
        {router.locale !== 'en' && (<><div className={styles.lang}>EN</div><ItemLink icon="none" item={item} locale="en"/></>)}
        {router.locale !== 'es' && (<><div className={styles.lang}>ES</div><ItemLink icon="none" item={item} locale="es"/></>)}
        {router.locale !== 'fr' && (<><div className={styles.lang}>FR</div><ItemLink icon="none" item={item} locale="fr"/></>)}
      </div>

      <Headline id="tp" noToc>Trading Post</Headline>
      {isTradeable ? (
        <>
          <b>Sell Price: </b>
          <div className={styles.tp}>
            <span><FormatNumber value={tpData?.sells?.quantity ?? 0}/> available</span>
            <Coins value={tpData?.sells?.unit_price ?? 0}/>
          </div>
          <b>Buy Price:</b>
          <div className={styles.tp}>
            <span><FormatNumber value={tpData?.buys?.quantity ?? 0}/> ordered</span>
            <Coins value={tpData?.buys?.unit_price ?? 0}/>
          </div>
        </>
      ) : (
        <>Not tradeable on the Trading Post</>
      )}


      <Headline id="links" noToc>Links</Headline>

      <a href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest&lang=${router.locale}`} target="api" rel="noreferrer noopener">API</a>


    </div>
  );
};
