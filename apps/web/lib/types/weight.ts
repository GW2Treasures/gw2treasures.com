import type { Skin } from '@gw2api/types/data/skin';

export type Weight = NonNullable<NonNullable<Skin['details']>['weight_class']>;
