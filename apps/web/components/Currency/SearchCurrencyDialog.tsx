'use client';

import { type LocalizedEntity, localizedName } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { Currency } from '@gw2treasures/database';
import { type FC, useEffect, useState } from 'react';
import { Dialog } from '@gw2treasures/ui/components/Dialog/Dialog';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { SkeletonTable } from '../Skeleton/SkeletonTable';
import { CurrencyLink } from './CurrencyLink';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { getLinkProperties } from '@/lib/linkProperties';
import { getCurrencies } from './SearchCurrencyDialogAction';
import { useLanguage } from '../I18n/Context';

export type SearchCurrencyDialogSubmitHandler = (currency?: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>) => void;

export interface SearchCurrencyDialogProps {
  onSubmit: SearchCurrencyDialogSubmitHandler;
  open: boolean;
}

export const SearchCurrencyDialog: FC<SearchCurrencyDialogProps> = ({ onSubmit, open }) => {
  const [searchValue, setSearchValue] = useState('');
  const [currencies, setCurrencies] = useState<WithIcon<Currency>[]>();
  const language = useLanguage();

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);


  return (
    <Dialog onClose={() => onSubmit(undefined)} title="Search Currency" open={open}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <TextInput placeholder="Name" value={searchValue} onChange={setSearchValue}/>
      </div>

      {currencies === undefined ? (
        <SkeletonTable columns={['Currency', 'Select']} rows={2}/>
      ) : (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell small>Select</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {currencies.filter((currency) => localizedName(currency, language).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())).map((currency) => (
              <tr key={currency.id}>
                <td>
                  <CurrencyLink currency={currency}/>
                </td>
                <td>
                  <Button onClick={() => onSubmit(getLinkProperties(currency))}>Select</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Dialog>
  );
};
