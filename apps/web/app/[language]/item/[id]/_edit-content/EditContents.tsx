'use client';

import { Dialog } from '@/components/Dialog/Dialog';
import { ItemLink } from '@/components/Item/ItemLink';
import { LocalizedEntity } from '@/lib/localizedName';
import { toggleArray } from '@/lib/toggleArray';
import { WithIcon } from '@/lib/with';
import { Content, ContentChance, Item } from '@gw2treasures/database';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Select } from '@gw2treasures/ui/components/Form/Select';
import { NumberInput } from '@gw2treasures/ui/components/Form/NumberInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { FC, useCallback, useEffect, useState } from 'react';
import { SearchItemDialog, SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import { Icon } from '@gw2treasures/ui';
import { CanSubmitResponse, canSubmit, submitToReview } from './actions';
import { AddedItem } from './types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import Link from 'next/link';
import { Notice } from '@/components/Notice/Notice';

export interface EditContentsProps {
  itemId: number;
  contents: (Content & {
    contentItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  })[]
}

export const EditContents: FC<EditContentsProps> = ({ itemId, contents }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchItemDialogOpen, setSearchItemDialogOpen] = useState(false);
  const [canSubmitState, setCanSubmitState] = useState<CanSubmitResponse>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if(dialogOpen) {
      setCanSubmitState(undefined);
      canSubmit(itemId).then(setCanSubmitState);
    }
  }, [dialogOpen, itemId]);

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

  const handleSubmit = useCallback(async () => {
    setError(false);
    const submitted = await submitToReview({ itemId, removedItems, addedItems });

    if(submitted) {
      setDialogOpen(false);
    } else {
      setError(true);
    }
  }, [itemId, addedItems, removedItems]);

  return (
    <>
      <Button onClick={toggleDialog}>Edit Contents</Button>
      <Dialog open={dialogOpen} onClose={toggleDialog} title="Edit Contents">
        {canSubmitState === undefined ? (
          <Skeleton/>
        ) : canSubmitState.canSubmit === false ? (
          canSubmitState.reason === 'LOGIN' ? (<p>You need to <Link href="/login">Login</Link> to submit changes.</p>) :
          canSubmitState.reason === 'PENDING_REVIEW' ? (
            canSubmitState.ownReview
              ? (<p>You must wait for your <Link href={`/review/container-content/${canSubmitState.reviewId}`}>suggested change</Link> to be reviewed before you can submit another change.</p>)
              : (<p>There is already a suggested changes for this item. You can <Link href={`/review/container-content/${canSubmitState.reviewId}`}>review the change now</Link>.</p>)
          ) :
          (<p>Unknown error</p>)
        ) : (
          <>
            {error && (<Notice type="error">Your changes could not be saved.</Notice>)}
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
                    <tr key={content.contentItemId} data-removed={isRemoved || undefined}>
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
                    <tr key={added._id} data-added>
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
            <p>After you submit this form, your changes will be reviewed before they are applied.</p>
            <Button onClick={handleSubmit}>Submit</Button>
          </>
        )}
      </Dialog>
    </>
  );
};
