import { useState, type FC } from 'react';
import type { Column } from './helper';
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { arrayMove, move } from '@dnd-kit/helpers';
import styles from './edit.module.css';
import { Icon } from '@gw2treasures/ui';
import { ItemLink } from '@/components/Item/ItemLink';
import { CurrencyLink } from '@/components/Currency/CurrencyLink';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { DialogActions } from '@gw2treasures/ui/components/Dialog/DialogActions';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { useJsonFetch } from '@/lib/useFetch';
import { useDebounce } from '@/lib/useDebounce';
import type { ApiItemSearchResponse } from '../api/item/search/route';

export interface EditDialogProps {
  columns: Column[],
  onEdit: (columns: Column[]) => void
}

type DragEndEvent = Parameters<typeof DragDropProvider>[0]['onDragEnd'];

export const EditDialog: FC<EditDialogProps> = ({ columns, onEdit }) => {
  const [sortedColumns, setSortedColumns] = useState(columns);

  const handleDragEnd: DragEndEvent = (e) => {
    console.log(e);
    if(e.operation.source?.type === 'new-column' && e.operation.target?.type === 'column-list') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSortedColumns(arrayMove([...sortedColumns, e.operation.source.data as Column], sortedColumns.length, (e.operation.source as any).sortable.index));
    } else if(e.operation.source?.type === 'column' && e.operation.target?.type === 'column') {
      console.log('internal move');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSortedColumns(arrayMove(sortedColumns, (e.operation.source as any).sortable.initialIndex, (e.operation.source as any).sortable.index));
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={styles.editDialog}>
        <ColumnList columns={sortedColumns}/>
        <div className={styles.searchSection}>
          <ItemSearch columns={sortedColumns}/>
        </div>
      </div>

      <DialogActions description="Drag and drop to add or reorder columns.">
        <Button onClick={() => onEdit(columns)} icon="cancel">Cancel</Button>
        <Button onClick={() => onEdit(sortedColumns)} icon="checkmark">Apply</Button>
      </DialogActions>
    </DragDropProvider>
  );
};

const ColumnList: FC<{ columns: Column[] }> = ({ columns }) => {
  const { ref } = useDroppable({
    id: 'column-list',
    type: 'column-list',
    accept: ['column', 'new-column'],
  });

  return (
    <div ref={ref} className={styles.columnList}>
      {columns.map((column, index) => (
        <ColumnItem key={`${column.type}-${column.id}`} column={column} index={index}/>
      ))}
    </div>
  );
};

const ColumnItem: FC<{ column: Column, index: number }> = ({ column, index }) => {
  const { ref, handleRef } = useSortable({
    id: `${column.type}-${column.id}`,
    index,
    group: 'column-list',
    type: 'column',
    data: column,
    accept: ['new-column', 'column'],
  });

  return (
    <div className={styles.column} ref={ref}>
      <div ref={handleRef}><Icon icon="menu" color="var(--color-text-muted)"/></div>
      {column.type === 'item' ? <ItemLink item={column.item!}/> :
       column.type === 'currency' ? <CurrencyLink currency={column.currency!}/> :
       column.type === 'achievement' ? <AchievementLink achievement={column.achievement!}/> : '?'}
    </div>
  );
};

const ColumnItemNew: FC<{ column: Column, index: number }> = ({ column, index }) => {
  const { ref, handleRef } = useSortable({
    id: `${column.type}-${column.id}`,
    index,
    group: 'new-column-list',
    type: 'new-column',
    data: column,
    accept: [],
  });

  return (
    <div className={styles.column} ref={ref}>
      <div ref={handleRef}><Icon icon="menu" color="var(--color-text-muted)"/></div>
      {column.type === 'item' ? <ItemLink item={column.item!}/> :
       column.type === 'currency' ? <CurrencyLink currency={column.currency!}/> :
       column.type === 'achievement' ? <AchievementLink achievement={column.achievement!}/> : '?'}
    </div>
  );
};

const ItemSearch: FC<{ columns: Column[] }> = ({ columns }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 1000);
  const search = useJsonFetch<ApiItemSearchResponse>(`/api/item/search?q=${encodeURIComponent(debouncedValue)}`);

  const { ref } = useDroppable({
    id: 'new-column-list',
    type: 'new-column-list',
    accept: ['new-column'],
  });

  const filteredItems = search.loading ? [] : search.data.items.filter((item) => !columns.some((column) => column.type === 'item' && column.id === item.id));

  return (
    <div>
      <TextInput placeholder="Name / Chatlink / ID" value={searchValue} onChange={setSearchValue}/>
      <div>
        {search.loading ? (
          'loading...'
        ) : filteredItems.length === 0 ? (
          <p>No items found</p>
        ) : (
          <div ref={ref}>
            {filteredItems.map((item, index) => (
              <ColumnItemNew key={item.id} column={{ type: 'item', id: item.id, item }} index={index}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
