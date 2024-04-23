import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { linkProperties } from '@/lib/linkProperties';
import { localizedName } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { unstable_cache } from 'next/cache';
import { DyeColor } from '@/components/Color/DyeColor';
import { hexToRgb } from '@/components/Color/hex-to-rgb';

const getColors = unstable_cache((language: Language) => {
  return db.color.findMany({
    select: {
      id: true,
      name_de: language === 'de',
      name_en: language === 'en',
      name_es: language === 'es',
      name_fr: language === 'fr',
      cloth_rgb: true,
      leather_rgb: true,
      metal_rgb: true,
      unlockedByItems: { select: linkProperties },
    },
    orderBy: { id: 'asc' }
  });
}, ['get-colors']);

export default async function ColorPage({ params }: { params: { language: Language }}) {
  const colors = await getColors(params.language);

  return (
    <HeroLayout hero={<Headline id="colors">Colors</Headline>} color="#f9a825">
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small align="right">ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell small>Cloth</Table.HeaderCell>
            <Table.HeaderCell small>Leather</Table.HeaderCell>
            <Table.HeaderCell small>Metal</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => {
            return (
              <tr key={color.id}>
                <td align="right">{color.id}</td>
                <td>{localizedName(color, params.language)}</td>
                <td>
                  <ItemList singleColumn>
                    {color.unlockedByItems.map((item) => (
                      <li key={item.id}><ItemLink item={item}/></li>
                    ))}
                  </ItemList>
                </td>
                <td><DyeColor color={hexToRgb(color.cloth_rgb)}/></td>
                <td><DyeColor color={hexToRgb(color.leather_rgb)}/></td>
                <td><DyeColor color={hexToRgb(color.metal_rgb)}/></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Colors',
};
