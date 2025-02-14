import { Scope } from '@gw2me/client';

export const requiredScopes = [
  // always required
  Scope.GW2_Account,

  // get all the characters
  // TODO: remove once using armory subscription
  Scope.GW2_Characters,

  // get inventories
  // TODO: remove once using armory subscription
  Scope.GW2_Inventories,

  // legendary armory
  Scope.GW2_Unlocks,

  // delivered items waiting for pickup
  // TODO: remove once using armory subscription
  Scope.GW2_Tradingpost,

  // Relic unlocks using `/v2/account/achievements`
  Scope.GW2_Progression,
];


export type RelicSet = {
  type?: 'Core' | 'SotO',
  order: number,
};
