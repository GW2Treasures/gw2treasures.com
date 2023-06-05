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

export interface EditContentsProps {
  contents: (Content & {
    contentItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  })[]
}

interface AddedItem {
  _id: string;
  itemIdText: string;
  itemId: number | undefined;
  quantity: number;
  chance: ContentChance;
  error: string | undefined;
}

export const EditContents: FC<EditContentsProps> = ({ contents }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setDialogOpen((open) => !open);
  }, [setDialogOpen]);

  const [removedItems, setRemovedItems] = useState<number[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  const addItem = useCallback(() => {
    setAddedItems((added) => [...added, { _id: crypto.randomUUID(), itemIdText: '', itemId: undefined, quantity: 1, chance: ContentChance.Chance, error: 'Invalid item id' }]);
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
                const itemId = parseItemId(update.itemIdText ?? added.itemIdText);
                const error =
                  (itemId === undefined) ? 'Invalid item id' :
                  (contents.some(({ contentItemId }) => contentItemId === itemId) && !removedItems.includes(itemId)) ? 'Item is already included above' :
                  (addedItems.some((a) => a._id !== added._id && a.itemId === added.itemId)) ? 'Item added multiple times' :
                  undefined;

                  setAddedItems((items) => items.map((a) => a._id === added._id ? { ...a, ...update, itemId, error } : a));
              };

              return (
                <tr key={added._id}>
                  <td>{added.itemIdText && (added.error ? <span style={{ color: 'red' }}>{added.error}</span> : <ItemLinkById id={added.itemId!}/>)}</td>
                  <td><TextInput value={added.itemIdText} onChange={(itemIdText) => edit({ itemIdText: itemIdText.trim() })} placeholder="Id / Chatlink"/></td>
                  <td><NumberInput value={added.quantity} onChange={(quantity) => edit({ quantity })}/></td>
                  <td><Select onChange={(chance) => edit({ chance: chance as ContentChance })} value={added.chance} options={Object.values(ContentChance).map((value) => ({ value, label: value }))}/></td>
                  <td><Button appearance="secondary" onClick={() => setAddedItems((items) => items.filter(({ _id }) => _id !== added._id))}>Remove</Button></td>
                </tr>
              );
            })}
            <TableRowButton onClick={addItem}>
              Add Item
            </TableRowButton>
          </tbody>
        </Table>
        <p>After you submit this form, your changes will be reviewed before they are public.</p>
        <Button onClick={handleSubmit}>Submit</Button>
      </Dialog>
    </>
  );
};

function parseItemId(itemId: string): number | undefined {
  if(itemId === '') {
    return undefined;
  }

  const number = Number(itemId);
  if(number.toFixed() === itemId && number > 0) {
    return number;
  }

  if(itemId.startsWith('[&')) {
    try {
      const parsedChatlink = decode(itemId);

      if(parsedChatlink !== false && parsedChatlink.type === 'item') {
        return parsedChatlink.id;
      }
    } catch {
      // parsing the link might fail but we don't care...
    }
  }

  return undefined;
}

const ItemLinkById: FC<{ id: number }> = ({ id }) => {
  const response = useJsonFetch<ApiItemLinkResponse>(`/api/item/link?id=${id}`);

  if(response.loading) {
    return <SkeletonLink/>;
  }

  return <ItemLink item={response.data}/>;
};
