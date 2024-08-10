import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import homeNodes from '@gw2efficiency/game-data/home/nodes';
import homeCats from '@gw2efficiency/game-data/home/cats';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { ItemLink } from '@/components/Item/ItemLink';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { parseIcon } from '@/lib/parseIcon';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';

export default async function HomesteadPage() {
  const nodeUnlockItemIds = homeNodes.reduce<number[]>((ids, node) => [...ids, ...node.unlock_items], []);

  const items = await db.item.findMany({
    where: { id: { in: nodeUnlockItemIds }},
    select: linkProperties
  });

  const unlockItems = groupById(items);

  const HomeNode = createDataTable(homeNodes, ({ id }) => id);
  const HomeCats = createDataTable(homeCats, ({ id }) => id);

  return (
    <HeroLayout color="#397aa1" hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>} toc>
      <Headline id="nodes" actions={<ColumnSelect table={HomeNode}/>}>Nodes</Headline>
      <HomeNode.Table>
        <HomeNode.Column id="id" title="Id" small hidden>{({ id }) => id}</HomeNode.Column>
        <HomeNode.Column id="node" title="Node" sortBy="name">{({ unlock_items: [id], name }) => unlockItems.has(id) ? <ItemLink item={unlockItems.get(id)!}/> : name}</HomeNode.Column>
      </HomeNode.Table>

      <Headline id="cats" actions={<ColumnSelect table={HomeCats}/>}>Cats</Headline>
      <HomeCats.Table>
        <HomeCats.Column id="id" title="Id" align="right" small hidden>{({ id }) => id}</HomeCats.Column>
        <HomeCats.Column id="name" title="Cat" sortBy="name">{({ name, icon }) => <FlexRow><EntityIcon icon={parseIcon(icon)!} size={32}/> {name}</FlexRow>}</HomeCats.Column>
        <HomeCats.Column id="desc" title="Description" sortBy="description">{({ description }) => <p style={{ color: 'var(--color-text-muted' }} dangerouslySetInnerHTML={{ __html: description }}/>}</HomeCats.Column>
      </HomeCats.Table>

      <Headline id="decorations">Decorations</Headline>
      <Notice>Decorations will be available soon.</Notice>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Homestead'
};

function groupById<T extends { id: unknown }>(values: T[]): Map<T['id'], T> {
  const map = new Map<T['id'], T>();

  for(const value of values) {
    map.set(value.id, value);
  }

  return map;
}
