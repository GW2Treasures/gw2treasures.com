import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { linkProperties } from '@/lib/linkProperties';
import { localizedName } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { unstable_cache } from 'next/cache';
import { DyeColor } from '@/components/Color/DyeColor';
import { hexToRgb } from '@/components/Color/hex-to-rgb';
import type { PageProps } from '@/lib/next';

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

export default async function ColorPage({ params }: PageProps) {
  const { language } = await params;
  const colors = await getColors(language);

  return (
    <>
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
                <td>{localizedName(color, language)}</td>
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
    </>
  );
}

export const metadata = {
  title: 'Colors',
};
