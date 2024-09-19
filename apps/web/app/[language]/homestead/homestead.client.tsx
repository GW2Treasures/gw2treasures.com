'use client';

import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Icon } from '@gw2treasures/ui';
import { FormatNumber } from '@/components/Format/FormatNumber';
import type { DataTableRowFilterComponent, DataTableRowFilterComponentProps } from '@gw2treasures/ui/components/Table/DataTable';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { HomesteadGlyphSlot } from '@gw2treasures/database';
import type { TranslationSubset } from '@/lib/translate';

export const requiredScopes = [Scope.GW2_Progression, Scope.GW2_Unlocks];

export const AccountHomeNodeCell: FC<{ nodeId: string; accountId: string; }> = ({ nodeId, accountId }) => {
  const nodes = useSubscription('home.nodes', accountId);

  if (nodes.loading) {
    return (<td><Skeleton/></td>);
  } else if (nodes.error) {
    return (<td/>);
  }

  const isUnlocked = nodes.data.includes(nodeId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};

export const AccountHomeCatCell: FC<{ catId: number; accountId: string; }> = ({ catId, accountId }) => {
  const cats = useSubscription('home.cats', accountId);

  if (cats.loading) {
    return (<td><Skeleton/></td>);
  } else if (cats.error) {
    return (<td/>);
  }

  const isUnlocked = cats.data.includes(catId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};


export const AccountHomesteadDecorationCell: FC<{ decorationId: number; accountId: string; }> = ({ decorationId, accountId }) => {
  const decorations = useSubscription('homestead.decorations', accountId);

  if (decorations.loading) {
    return (<td><Skeleton/></td>);
  } else if (decorations.error) {
    return (<td/>);
  }

  const decoration = decorations.data.find(({ id }) => id === decorationId);

  return decoration ? (
    <td align="right"><FormatNumber value={decoration?.count}/></td>
  ) : (
    <td/>
  );
};

type GlyphSlotTranslations = TranslationSubset<'homestead.glyphs.slot.harvesting' | 'homestead.glyphs.slot.logging' | 'homestead.glyphs.slot.mining'>;

export const AccountHomesteadGlyphsCell: FC<{ glyphIdPrefix: string; accountId: string; slotTranslations: GlyphSlotTranslations }> = ({ glyphIdPrefix, accountId, slotTranslations }) => {
  const glyphs = useSubscription('homestead.glyphs', accountId);

  if (glyphs.loading) {
    return (<td colSpan={3}><Skeleton/></td>);
  } else if (glyphs.error) {
    return (<td colSpan={3}/>);
  }

  return Object.values(HomesteadGlyphSlot).map((slot) => {
    const isActive = glyphs.data.includes(`${glyphIdPrefix}_${slot}`);

    return (
      <ProgressCell key={slot} progress={isActive ? 1 : 0} small>
        <span style={{ color: !isActive ? 'var(--color-text-muted)' : undefined }}>
          {slotTranslations[`homestead.glyphs.slot.${slot}`]}
        </span>
      </ProgressCell>
    );
  });
};

interface DecorationTableContext {
  filteredRows?: number[] | undefined;
  categoryMap: Map<number, { name: string, decorationIndexes: number[] }>

  categoryIds: number[];
  setCategoryIds: (categoryIds: number[]) => void;
}

const context = createContext<DecorationTableContext>({ filteredRows: undefined, categoryMap: new Map(), categoryIds: [], setCategoryIds: () => {} });

export interface DecorationTableProviderProps {
  categories: { id: number, name: string, decorationIndexes: number[] }[];
  children: ReactNode;
}


export const DecorationTableProvider: FC<DecorationTableProviderProps> = ({ children, categories }) => {
  const categoryMap = new Map(categories.map(({ id, ...category }) => [id, category]));
  const allCategoryIds = categories.map(({ id }) => id);

  const [categoryIds, setCategoryIds] = useState(allCategoryIds);

  const filteredRows = categoryIds.length !== allCategoryIds.length
    ? categoryIds.flatMap((id) => categoryMap.get(id)?.decorationIndexes ?? [])
    : undefined;

  return (
    <context.Provider value={{ filteredRows, categoryIds, setCategoryIds, categoryMap }}>
      {children}
    </context.Provider>
  );
};

export const DecorationRowFilter: DataTableRowFilterComponent = ({ children, index }: DataTableRowFilterComponentProps) => {
  const { filteredRows } = useContext(context);
  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  return <tr hidden={!isVisible}>{children}</tr>;
};

export interface DecorationTableFilterProps {
  totalCount: number;
}

export const DecorationTableFilter: FC<DecorationTableFilterProps> = ({ totalCount: count }) => {
  const { categoryMap, categoryIds, setCategoryIds } = useContext(context);

  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if(e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if(e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', keyDown, { passive: true });
    window.addEventListener('keyup', keyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);


  return (
    <DropDown button={<Button icon={categoryMap.size === categoryIds.length ? 'filter' : 'filter-active'}>Filter</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={categoryIds.length > 0} indeterminate={categoryIds.length < categoryMap.size && categoryIds.length > 0} onChange={() => setCategoryIds(categoryIds.length > 0 ? [] : Array.from(categoryMap.keys()))}>
          <FlexRow align="space-between">
            All
            <span style={{ paddingLeft: 8 }}>{count}</span>
          </FlexRow>
        </Checkbox>
        <Separator/>
        {Array.from(categoryMap.entries()).map(([categoryId, category]) => (
          <Checkbox key={categoryId} checked={categoryIds.includes(categoryId)} onChange={() => isShiftPressed ? setCategoryIds([categoryId]) : setCategoryIds(toggleArray(categoryIds, categoryId))}>
            <FlexRow align="space-between">
              <span>{category.name}</span>
              <span style={{ paddingLeft: 8, color: category.decorationIndexes.length === 0 ? 'var(--color-text-muted)' : undefined }}>{category.decorationIndexes.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
        <Separator/>
        <span style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Tip: Hold <kbd style={{ border: '1px solid var(--color-border-dark)', borderRadius: 2, padding: '1px 3px' }}>Shift</kbd> to select a single category</span>
      </MenuList>
    </DropDown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}
