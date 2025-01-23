import { Coins } from '@/components/Format/Coins';
import { ItemLink, type ItemLinkProps } from '@/components/Item/ItemLink';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import type { FC } from 'react';

export interface InventoryTableProps {
  envelope: ItemLinkProps['item']
}

export const InventoryTable: FC<InventoryTableProps> = ({ envelope }) => {
  return (
    <Table>
      <thead>
        <tr>
          <Table.HeaderCell>Account</Table.HeaderCell>
          <Table.HeaderCell align="right">Coins</Table.HeaderCell>
          <Table.HeaderCell align="right"><ItemLink item={envelope} icon={32}/></Table.HeaderCell>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>darthmaim.6017</td>
          <td align="right"><Coins value={10204975}/></td>
          <td align="right">0</td>
        </tr>
        <tr>
          <td>2nd Account</td>
          <td align="right"><Coins value={0}/></td>
          <td align="right">0</td>
        </tr>
      </tbody>
    </Table>
  );
};

/*

      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.items.login"/>} authorizationMessage={<Trans id="festival.items.authorize"/>}>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Headline id={item.id.toString()}><ItemLink item={item}/></Headline>
            <ItemInventoryTable itemId={item.id}/>
          </Fragment>
        ))}
      </Gw2Accounts>
      */
