import type { Gw2Api } from 'gw2-api-types';

export type Weight = NonNullable<NonNullable<Gw2Api.Skin['details']>['weight_class']>;
