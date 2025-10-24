'use client';

import { type FC } from 'react';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Icon } from '@gw2treasures/ui';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { HomesteadGlyphSlot } from '@gw2treasures/database';
import type { TranslationSubset } from '@/lib/translate';
import { SortableDynamicDataTableCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';

export const requiredScopes = [Scope.GW2_Progression, Scope.GW2_Unlocks];

export const AccountHomeNodeCell: FC<{ nodeId: string, accountId: string }> = ({ nodeId, accountId }) => {
  const nodes = useSubscription('home.nodes', accountId);

  if (nodes.loading) {
    return (<td><Skeleton/></td>);
  } else if (nodes.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const isUnlocked = nodes.data.includes(nodeId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};

export const AccountHomeCatCell: FC<{ catId: number, accountId: string }> = ({ catId, accountId }) => {
  const cats = useSubscription('home.cats', accountId);

  if (cats.loading) {
    return (<td><Skeleton/></td>);
  } else if (cats.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const isUnlocked = cats.data.includes(catId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};


export const AccountHomesteadDecorationCell: FC<{ decorationId: number, accountId: string }> = ({ decorationId, accountId }) => {
  const decorations = useSubscription('homestead.decorations', accountId);

  if (decorations.loading) {
    return (<td><Skeleton/></td>);
  } else if (decorations.error) {
    return (<td><Gw2ApiErrorBadge/></td>);
  }

  const decoration = decorations.data.find(({ id }) => id === decorationId);

  return decoration ? (
    <SortableDynamicDataTableCell value={decoration?.count}>
      <td align="right"><FormatNumber value={decoration?.count}/></td>
    </SortableDynamicDataTableCell>
  ) : (
    <td/>
  );
};

type GlyphSlotTranslations = TranslationSubset<'homestead.glyphs.slot.harvesting' | 'homestead.glyphs.slot.logging' | 'homestead.glyphs.slot.mining'>;

export const AccountHomesteadGlyphsCell: FC<{ glyphIdPrefix: string, accountId: string, slotTranslations: GlyphSlotTranslations }> = ({ glyphIdPrefix, accountId, slotTranslations }) => {
  const glyphs = useSubscription('homestead.glyphs', accountId);

  if (glyphs.loading) {
    return (<td colSpan={3}><Skeleton/></td>);
  } else if (glyphs.error) {
    return (<td colSpan={3}><Gw2ApiErrorBadge/></td>);
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
