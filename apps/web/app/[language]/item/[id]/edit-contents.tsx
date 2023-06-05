'use client';

import { Dialog } from '@/components/Dialog/Dialog';
import { ItemLink } from '@/components/Item/ItemLink';
import { LocalizedEntity } from '@/lib/localizedName';
import { toggleArray } from '@/lib/toggleArray';
import { WithIcon } from '@/lib/with';
import { Content, ContentChance, Item } from '@gw2treasures/database';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Select } from '@gw2treasures/ui/components/Form/Select';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { NumberInput } from '@gw2treasures/ui/components/Form/NumberInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { FC, useCallback, useState } from 'react';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { decode } from 'gw2e-chat-codes';
import { useJsonFetch } from '@/lib/useFetch';
import { ApiItemLinkResponse } from 'app/api/item/link/route';
import { SearchItemDialog, SearchItemDialogProps, SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import { Icon } from '@gw2treasures/ui';

export interface EditContentsProps {
  contents: (Content & {
    contentItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  })[]
}

interface AddedItem {
  _id: string;
  item: WithIcon<{
    id: number;
    rarity: string;
  } & LocalizedEntity>;
  quantity: number;
  chance: ContentChance;
}

export const EditContents: FC<EditContentsProps> = ({ contents }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchItemDialogOpen, setSearchItemDialogOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setDialogOpen((open) => !open);
  }, [setDialogOpen]);

  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  const addItem: SearchItemDialogSubmitHandler = useCallback((item) => {
    setSearchItemDialogOpen(false);

    if(item) {
      setAddedItems((added) => [...added, { _id: crypto.randomUUID(), item, quantity: 1, chance: ContentChance.Chance }]);
    }
  }, [setAddedItems]);

  const handleSubmit = useCallback(() => {
    const data = {
      removedItems,
      addedItems,
    };

    console.log(data);
  }, [addedItems, removedItems]);

  return (
    <>
      <Button onClick={toggleDialog}>Edit Contents</Button>
      <Dialog open={dialogOpen} onClose={toggleDialog} title="Edit Contents">
        <p>Noticed something wrong with the contents of this item? You can remove and add items in this dialog.</p>
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Item</Table.HeaderCell>
              <Table.HeaderCell>Item Id</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Chance</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => {
              const isRemoved = removedItems.includes(content.contentItemId);
              return (
                <tr key={content.contentItemId} style={isRemoved ? { backgroundColor: '#fee' } : undefined}>
                  <td><ItemLink item={content.contentItem}/></td>
                  <td>{content.contentItemId}</td>
                  <td>{content.quantity}</td>
                  <td>{content.chance}</td>
                  <td><Button appearance="secondary" onClick={() => setRemovedItems(toggleArray(content.contentItemId))}>{isRemoved ? 'Revert' : 'Remove'}</Button></td>
                </tr>
              );
            })}
            {addedItems.map((added) => {
              const edit = (update: Partial<AddedItem>) => {
                setAddedItems((items) => items.map((a) => a._id === added._id ? { ...a, ...update } : a));
              };

              return (
                <tr key={added._id}>
                  <td><ItemLink item={added.item}/></td>
                  <td>{added.item.id}</td>
                  <td><NumberInput value={added.quantity} onChange={(quantity) => edit({ quantity })}/></td>
                  <td><Select onChange={(chance) => edit({ chance: chance as ContentChance })} value={added.chance} options={Object.values(ContentChance).map((value) => ({ value, label: value }))}/></td>
                  <td><Button appearance="secondary" onClick={() => setAddedItems((items) => items.filter(({ _id }) => _id !== added._id))}>Remove</Button></td>
                </tr>
              );
            })}
            <TableRowButton onClick={() => setSearchItemDialogOpen(true)}>
              <Icon icon="add"/> Add Item
            </TableRowButton>
          </tbody>
        </Table>
        {searchItemDialogOpen && (<SearchItemDialog onSubmit={addItem}/>)}
        <p>After you submit this form, your changes will be reviewed before they are public.</p>
        <Button onClick={handleSubmit}>Submit</Button>
      </Dialog>
    </>
  );
};
