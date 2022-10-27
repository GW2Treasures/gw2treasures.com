import { Language } from "@prisma/client";
import { ApiItem } from "../../apiTypes";
import fetch from 'node-fetch';

export async function loadItems(ids: number[]): Promise<{ [key in Language]: ApiItem }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([    
    fetch(`https://api.guildwars2.com/v2/items?lang=de&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiItem[]>,
    fetch(`https://api.guildwars2.com/v2/items?lang=en&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiItem[]>,
    fetch(`https://api.guildwars2.com/v2/items?lang=es&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiItem[]>,
    fetch(`https://api.guildwars2.com/v2/items?lang=fr&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiItem[]>,
  ]);

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`)

  const items = en.map((item) => ({
    en: item,
    de: de.find(({ id }) => id === item.id)!,
    es: es.find(({ id }) => id === item.id)!,
    fr: fr.find(({ id }) => id === item.id)!,
  }));

  return items;
}
