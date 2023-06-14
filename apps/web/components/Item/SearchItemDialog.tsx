'use client';

import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { Item } from '@gw2treasures/database';
import { FC, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { useDebounce } from '@/lib/useDebounce';
import { useJsonFetch } from '@/lib/useFetch';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { ApiItemSearchResponse } from 'app/[language]/api/item/search/route';
import { ItemLink } from './ItemLink';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { getLinkProperties } from '@/lib/linkProperties';

export type SearchItemDialogSubmitHandler = (item?: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>) => void;

export interface SearchItemDialogProps {
  onSubmit: SearchItemDialogSubmitHandler;
  open: boolean;
}

export const SearchItemDialog: FC<SearchItemDialogProps> = ({ onSubmit, open }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 1000);
  const search = useJsonFetch<ApiItemSearchResponse>(`/api/item/search?q=${encodeURIComponent(debouncedValue)}`);

  return (
    <Dialog onClose={() => onSubmit(undefined)} title="Search Item" open={open}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <TextInput placeholder="Name / Chatlink / ID" value={searchValue} onChange={setSearchValue}/>
      </div>

      {search.loading ? (
        <SkeletonTable columns={['Item', 'Select']} rows={2}/>
      ) : search.data.items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Item</Table.HeaderCell>
              <Table.HeaderCell small>Select</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {search.data.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <ItemLink item={item}/>
                </td>
                <td>
                  <Button onClick={() => onSubmit(getLinkProperties(item))}>Select</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Dialog>
  );
};
