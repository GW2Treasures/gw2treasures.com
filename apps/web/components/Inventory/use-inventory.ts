import { useSubscription } from '../Gw2Api/use-gw2-subscription';
import type { ItemStack } from '@gw2api/types/data/item';
import type { SharedInventoryItemStack } from '@gw2api/types/data/account-inventory';
import type { CharacterEquipmentEntry, Profession } from '@gw2api/types/data/character';

export enum UseInventoryItemAccountLocation {
  Bank = 0,
  Materials = 1,
  SharedInventory = 2,
  LegendaryArmory = 3,
  Delivery = 4,
}

export enum UseInventoryItemCharacterLocation {
  Inventory = -1,
  Equipment = -2,
  EquipmentTemplate = -3,
}

type Character = { name: string, profession: Profession };

export type UseInventoryItemResultLocation =
 | { count: number, location: UseInventoryItemAccountLocation }
 | { count: number, location: Exclude<UseInventoryItemCharacterLocation, UseInventoryItemCharacterLocation.EquipmentTemplate>, character: Character }
 | { count: number, location: UseInventoryItemCharacterLocation.EquipmentTemplate, character: Character, tab?: string };

export type UseInventoryItemResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, locations: UseInventoryItemResultLocation[] };


/** Get a list of locations containing this item in the accounts inventory */
export function useInventoryItem(accountId: string, itemId: number): UseInventoryItemResult {
  const inventories = useSubscription('inventories', accountId);

  if(inventories.loading || inventories.error) {
    return inventories;
  }

  // get all the different locations for items
  const { bank, materials, armory, sharedInventory, characters, delivery } = inventories.data;

  // create a filter that filters the inventories by item id
  const isItemId = isItemIdFilter(itemId);

  // get counts in account inventories
  const inBank = bank.flatMap(mapItemWithUpgradesToItems).filter(isItemId).reduce(sumItemCount, 0);
  const inMaterials = materials.flatMap(mapItemWithUpgradesToItems).filter(isItemId).reduce(sumItemCount, 0);
  const inSharedInventory = sharedInventory.flatMap(mapItemWithUpgradesToItems).filter(isItemId).reduce(sumItemCount, 0);
  const inLegendaryArmory = armory.filter(isItemId).reduce(sumItemCount, 0);
  const inDelivery = delivery.items.filter(isItemId).reduce(sumItemCount, 0);

  // get item counts in each characters
  const inCharacters: UseInventoryItemResultLocation[] = characters.flatMap((char) => {
    const character: Character = {
      name: char.name,
      profession: char.profession,
    };

    // items in the inventory of a character
    const inCharactersBags = char.bags?.flatMap((bag) => bag?.inventory).flatMap(mapItemWithUpgradesToItems).filter(isItemId).reduce(sumItemCount, 0);

    // the bags a character has equipped
    const inCharactersEquippedBags = char.bags?.filter(isItemId).length;

    // some slots are missing in equipment_tabs
    const otherSlots = [
      'Sickle',
      'Axe',
      'Pick',
      'FishingRod',
      'FishingBait',
      'FishingLure',
      'PowerCore',
      'SensoryArray',
      'Relic' // https://github.com/gw2-api/issues/issues/87
    ];
    const inCharactersEquipmentOther = char.equipment?.filter(({ slot }) => otherSlots.includes(slot))
      .flatMap((e) => mapItemWithUpgradesToItems(e as ItemStackLike))
      .filter(isItemId)
      .length;

    // count items in equipment tabs
    // if the item is a legendary (inLegendaryArmory > 0) we skip it to not count it multiple times (TODO: but maybe we want still know which characters are using it?)
    const inCharactersEquipment = (inLegendaryArmory > 0 || char.equipment_tabs === undefined) ? [] : char.equipment_tabs.map((tab) => ({
      count: tab.equipment.flatMap(mapItemWithUpgradesToItems)
        .filter(isItemId)
        // Exclude items that are also equipped in the active tab or in a tab with a lower index, so that linked items are only counted once
        // this is currently broken because of https://github.com/gw2-api/issues/issues/12
        .filter((item) => tab.is_active || (isEquipmentItem(item) ? !item.tabs.some((tabId) => tabId === char.active_equipment_tab || tabId < tab.tab) : true))
        .reduce(sumItemCount, 0),
      location: tab.is_active ? UseInventoryItemCharacterLocation.Equipment : UseInventoryItemCharacterLocation.EquipmentTemplate,
      character,
      tab: tab.name,
    }));

    return [
      { count: inCharactersBags ?? 0, location: UseInventoryItemCharacterLocation.Inventory, character },
      { count: inCharactersEquippedBags ?? 0, location: UseInventoryItemCharacterLocation.Equipment, character },
      { count: inCharactersEquipmentOther ?? 0, location: UseInventoryItemCharacterLocation.Equipment, character },
      ...inCharactersEquipment,
    ];
  });

  const locations: UseInventoryItemResultLocation[] = [
    { count: inBank, location: UseInventoryItemAccountLocation.Bank },
    { count: inMaterials, location: UseInventoryItemAccountLocation.Materials },
    { count: inSharedInventory, location: UseInventoryItemAccountLocation.SharedInventory },
    { count: inLegendaryArmory, location: UseInventoryItemAccountLocation.LegendaryArmory },
    { count: inDelivery, location: UseInventoryItemAccountLocation.Delivery },
    ...inCharacters,
  ].filter(hasNonEmptyCount).sort((a, b) => b.count - a.count);

  return {
    loading: false,
    error: false,
    locations
  };
}

export type UseInventoryItemTotalResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, count: number };

export function useInventoryItemTotal(accountId: string, itemId: number): UseInventoryItemTotalResult {
  // get all locations of this item...
  const inventory = useInventoryItem(accountId, itemId);

  // ...make sure everything is loaded...
  if(inventory.loading || inventory.error) {
    return inventory;
  }

  // ...and merge them into the total count
  const total = inventory.locations.reduce(sumItemCount, 0);

  return { loading: false, error: false, count: total };
}

function isItemIdFilter(itemId: number) {
  return <T extends { id: number }>(item: T | null | undefined): item is T => item?.id === itemId;
}

function isEquipmentItem(item: unknown): item is CharacterEquipmentEntry<'2019-12-19T00:00:00.000Z'> {
  return typeof item === 'object' && item != null && 'tabs' in item;
}

export function sumItemCount(total: number, { count }: { count?: number }) {
  return total + (count ?? 1);
}

function mapItemWithUpgradesToItems(item: ItemStackLike | null | undefined): ({ id: number, count?: number } | null | undefined)[] {
  return [
    item,
    ...(item?.upgrades?.map((id) => ({ id })) ?? []),
    ...(item?.infusions?.map((id) => ({ id })) ?? []),
  ];
}

function hasNonEmptyCount<T extends { count: number }>(value: T | undefined): value is T {
  return value !== undefined && value.count !== undefined && value.count > 0;
}

type ItemStackLike = ItemStack | SharedInventoryItemStack | Omit<CharacterEquipmentEntry<'2019-12-19T00:00:00.000Z'>, 'tabs'>;
