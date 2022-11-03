import { Language } from "@prisma/client";
import { ApiSkin } from "../../apiTypes";
import fetch from 'node-fetch';

export async function loadSkins(ids: number[]): Promise<{ [key in Language]: ApiSkin }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetch(`https://api.guildwars2.com/v2/skins?lang=de&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiSkin[]>,
    fetch(`https://api.guildwars2.com/v2/skins?lang=en&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiSkin[]>,
    fetch(`https://api.guildwars2.com/v2/skins?lang=es&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiSkin[]>,
    fetch(`https://api.guildwars2.com/v2/skins?lang=fr&v=latest&ids=${ids.join(',')}`).then((r) => r.json()) as Promise<ApiSkin[]>,
  ]);

  console.log(`Fetched ${ids.length} skins in ${(new Date().valueOf() - start.valueOf()) / 1000}s`)

  const skins = en.map((skin) => ({
    en: skin,
    de: de.find(({ id }) => id === skin.id)!,
    es: es.find(({ id }) => id === skin.id)!,
    fr: fr.find(({ id }) => id === skin.id)!,
  }));

  return skins;
}
