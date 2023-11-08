import type { LocalizedEntity } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import { ContentChance } from '@gw2treasures/database';

export interface AddedItem {
  _id: string;
  item: WithIcon<{
    id: number;
    rarity: string;
  } & LocalizedEntity>;
  quantity: number;
  chance: ContentChance;
}

export interface AddedCurrency {
  _id: string;
  currency: WithIcon<{
    id: number;
  } & LocalizedEntity>;
  min: number;
  max: number;
}

export interface EditContentOrder {
  removedItems: number[];
  addedItems: AddedItem[];

  removedCurrencies: number[];
  addedCurrencies: AddedCurrency[];
}

export enum EditContentSubmitError {
  NO_CHANGES = 'NO_CHANGES',
  PENDING_REVIEW = 'PENDING_REVIEW',
  LOGIN = 'LOGIN',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export type CanSubmitResponse =
  { canSubmit: true, userId: string } |
  { canSubmit: false, reason: EditContentSubmitError.LOGIN } |
  { canSubmit: false, reason: EditContentSubmitError.PENDING_REVIEW, reviewId: string, ownReview: boolean };
