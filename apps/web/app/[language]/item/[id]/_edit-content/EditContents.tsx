'use client';

import { Dialog } from '@/components/Dialog/Dialog';
import { ItemLink } from '@/components/Item/ItemLink';
import type { LocalizedEntity } from '@/lib/localizedName';
import { toggleArray } from '@/lib/toggleArray';
import type { WithIcon } from '@/lib/with';
import { type Content, ContentChance, type Currency, type CurrencyContent, type Item } from '@gw2treasures/database';
import { Button, type ButtonProps } from '@gw2treasures/ui/components/Form/Button';
import { Select } from '@gw2treasures/ui/components/Form/Select';
import { NumberInput } from '@gw2treasures/ui/components/Form/NumberInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableRowButton } from '@gw2treasures/ui/components/Table/TableRowButton';
import { type FC, useCallback, useEffect, useState } from 'react';
import { SearchItemDialog, type SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import { Icon } from '@gw2treasures/ui';
import { canSubmit, submitToReview } from './actions';
import { type AddedCurrency, type AddedItem, type CanSubmitResponse, EditContentSubmitError } from './types';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import Link from 'next/link';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { SearchCurrencyDialog, type SearchCurrencyDialogSubmitHandler } from '@/components/Currency/SearchCurrencyDialog';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { Coins } from '@/components/Format/Coins';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { DialogActions } from '@/components/Dialog/DialogActions';

export interface EditContentsProps {
  appearance?: ButtonProps['appearance'];
  itemId: number;
  contents: (Content & {
    contentItem: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  })[];
  currencyContents: (CurrencyContent & {
    currency: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>
  })[];
}

export const EditContents: FC<EditContentsProps> = ({ itemId, contents, currencyContents, appearance }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchItemDialogOpen, setSearchItemDialogOpen] = useState(false);
  const [searchCurrencyDialogOpen, setSearchCurrencyDialogOpen] = useState(false);
  const [canSubmitState, setCanSubmitState] = useState<CanSubmitResponse>();
  const [error, setError] = useState<EditContentSubmitError>();

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

  const [removedCurrencies, setRemovedCurrencies] = useState<number[]>([]);
  const [addedCurrencies, setAddedCurrencies] = useState<AddedCurrency[]>([]);

  const addCurrency: SearchCurrencyDialogSubmitHandler = useCallback((currency) => {
    setSearchCurrencyDialogOpen(false);

    if(currency) {
      setAddedCurrencies((added) => [...added, { _id: crypto.randomUUID(), currency, min: 0, max: 0 }]);
    }
  }, [setAddedCurrencies]);

  const handleSubmit = useCallback(async () => {
    setError(undefined);
    const submitted = await submitToReview({ itemId, removedItems, addedItems, removedCurrencies, addedCurrencies });

    if(submitted === true) {
      setDialogOpen(false);
    } else {
      setError(submitted);
    }
  }, [itemId, removedItems, addedItems, removedCurrencies, addedCurrencies]);

  return (
    <>
      <Button onClick={toggleDialog} appearance={appearance} icon="item">Edit Contents</Button>
      <Dialog open={dialogOpen} onClose={toggleDialog} title="Edit Contents">
        {canSubmitState === undefined ? (
          <Skeleton/>
        ) : canSubmitState.canSubmit === false ? (
          canSubmitState.reason === 'LOGIN' ? (<p>You need to <Link href={`/login?returnTo=${encodeURIComponent(`/item/${itemId}`)}`}>Login</Link> to submit changes.</p>) :
          canSubmitState.reason === 'PENDING_REVIEW' ? (
            canSubmitState.ownReview
              ? (<p>You must wait for your <Link href={`/review/container-content/${canSubmitState.reviewId}`}>suggested change</Link> to be reviewed before you can submit another change.</p>)
              : (<p>There is already a suggested change for this item. You can <Link href={`/review/container-content/${canSubmitState.reviewId}`}>review the change now</Link>.</p>)
          ) :
          (<p>Unknown error</p>)
        ) : (
          <>
            {error && (<Notice type="error">Your changes could not be saved ({error}).</Notice>)}
            <p>Noticed something wrong with the contents of this item? You can remove and add items in this dialog.</p>
            <Headline id="items">Items</Headline>
            <Table>
              <thead>
                <tr>
                  <Table.HeaderCell>Item</Table.HeaderCell>
                  <Table.HeaderCell>Item Id</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Chance</Table.HeaderCell>
                  <Table.HeaderCell small>Action</Table.HeaderCell>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => {
                  const isRemoved = removedItems.includes(content.contentItemId);
                  return (
                    <tr key={content.contentItemId} data-removed={isRemoved || undefined}>
                      <td><ItemLink item={content.contentItem}/></td>
                      <td>{content.contentItemId}</td>
                      <td><FormatNumber value={content.quantity}/></td>
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
            <SearchItemDialog onSubmit={addItem} open={searchItemDialogOpen}/>

            <Headline id="currency">Currency</Headline>
            <Table>
              <thead>
                <tr>
                  <Table.HeaderCell>Currency</Table.HeaderCell>
                  <Table.HeaderCell align="right">Min</Table.HeaderCell>
                  <Table.HeaderCell align="right">Max</Table.HeaderCell>
                  <Table.HeaderCell small>Action</Table.HeaderCell>
                </tr>
              </thead>
              <tbody>
                {currencyContents.map((content) => {
                  const isRemoved = removedCurrencies.includes(content.currencyId);
                  return (
                    <tr key={content.currencyId} data-removed={isRemoved || undefined}>
                      <td><CurrencyLink currency={content.currency}/></td>
                      <td align="right"><CurrencyValue currencyId={content.currencyId} value={content.min}/></td>
                      <td align="right"><CurrencyValue currencyId={content.currencyId} value={content.max}/></td>
                      <td><Button appearance="secondary" onClick={() => setRemovedCurrencies(toggleArray(content.currencyId))}>{isRemoved ? 'Revert' : 'Remove'}</Button></td>
                    </tr>
                  );
                })}
                {addedCurrencies.map((added) => {
                  const edit = (update: Partial<AddedCurrency>) => {
                    setAddedCurrencies((currencies) => currencies.map((a) => a._id === added._id ? { ...a, ...update } : a));
                  };

                  return (
                    <tr key={added._id} data-added>
                      <td><CurrencyLink currency={added.currency}/></td>
                      <td align="right"><NumberInput value={added.min} onChange={(min) => edit({ min })}/> {added.currency.id === 1 && (<Coins value={added.min}/>)}</td>
                      <td align="right"><NumberInput value={added.max} onChange={(max) => edit({ max })}/> {added.currency.id === 1 && (<Coins value={added.max}/>)}</td>
                      <td><Button appearance="secondary" onClick={() => setAddedCurrencies((currencies) => currencies.filter(({ _id }) => _id !== added._id))}>Remove</Button></td>
                    </tr>
                  );
                })}
                <TableRowButton onClick={() => setSearchCurrencyDialogOpen(true)}>
                  <Icon icon="add"/> Add Currency
                </TableRowButton>
              </tbody>
            </Table>
            <SearchCurrencyDialog onSubmit={addCurrency} open={searchCurrencyDialogOpen}/>

            <DialogActions description="Your changes will be reviewed before they are applied.">
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
