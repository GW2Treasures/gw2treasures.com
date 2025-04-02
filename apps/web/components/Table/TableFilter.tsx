import type { FC, ReactNode } from 'react';
import * as base from '@gw2treasures/ui/components/Table/TableFilter';
import { getLanguage, translate } from '@/lib/translate';
import { Trans } from '../I18n/Trans';

export { TableFilterRow, createSearchIndex } from '@gw2treasures/ui/components/Table/TableFilter';
export type * from '@gw2treasures/ui/components/Table/TableFilter';

export const TableFilterButton: FC<Omit<base.TableFilterButtonProps, 'children' | 'all'> & { children?: ReactNode }> = ({ children, ...props }) => {
  const label = children ?? <Trans id="table.filter"/>;
  const all = <Trans id="table.filter.all"/>;

  return (
    <base.TableFilterButton {...props} all={all}>{label}</base.TableFilterButton>
  );
}

export const TableFilterProvider: FC<Omit<base.TableFilterProviderProps, 'language'>> = async (props) => {
  const language = await getLanguage();

  return (
    <base.TableFilterProvider {...props} language={language}/>
  );
};

export const TableSearchInput: FC<base.TableSearchInputProps> = async ({ placeholder, ...props}) => {
  const placeholderWithFallback = placeholder ?? translate('search.placeholder', await getLanguage());

  return (
    <base.TableSearchInput {...props} placeholder={placeholderWithFallback}/>
  );
};
