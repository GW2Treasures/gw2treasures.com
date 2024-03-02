import type { SubType, Type, TypeWithSubtype } from './ItemType.types';

type TranslationKey<T extends Type> = T extends TypeWithSubtype ? `${T}.${SubType<T>}` : T;
export type TypeTranslation<T extends Type, S extends SubType<T>> = T extends TypeWithSubtype ? `${'item.type' | 'item.type.short'}.${T}.${S}` | `item.type.${T}` : `item.type.${T}`;

const typeTranslationKeys = ['Armor', 'Back', 'Bag', 'Consumable', 'Container', 'CraftingMaterial', 'Gathering', 'Gizmo', 'JadeTechModule', 'Key', 'MiniPet', 'PowerCore', 'Relic', 'Tool', 'Trait', 'Trinket', 'Trophy', 'UpgradeComponent', 'Weapon'] as const satisfies Type[];
const subtypeTranslationKeys = ['Armor.Boots', 'Armor.Coat', 'Armor.Gloves', 'Armor.Helm', 'Armor.HelmAquatic', 'Armor.Leggings', 'Armor.Shoulders', 'Consumable.AppearanceChange', 'Consumable.Booze', 'Consumable.ContractNpc', 'Consumable.Currency', 'Consumable.Food', 'Consumable.Generic', 'Consumable.Halloween', 'Consumable.Immediate', 'Consumable.MountRandomUnlock', 'Consumable.RandomUnlock', 'Consumable.TeleportToFriend', 'Consumable.Transmutation', 'Consumable.Unlock', 'Consumable.UpgradeRemoval', 'Consumable.Utility', 'Container.Default', 'Container.GiftBox', 'Container.Immediate', 'Container.OpenUI', 'Gathering.Bait', 'Gathering.Foraging', 'Gathering.Logging', 'Gathering.Lure', 'Gathering.Mining', 'Gizmo.ContainerKey', 'Gizmo.Default', 'Gizmo.RentableContractNpc', 'Gizmo.UnlimitedConsumable', 'Tool.Salvage', 'Trinket.Accessory', 'Trinket.Amulet', 'Trinket.Ring', 'UpgradeComponent.Default', 'UpgradeComponent.Gem', 'UpgradeComponent.Rune', 'UpgradeComponent.Sigil', 'Weapon.Axe', 'Weapon.Dagger', 'Weapon.Focus', 'Weapon.Greatsword', 'Weapon.Hammer', 'Weapon.Harpoon', 'Weapon.LargeBundle', 'Weapon.LongBow', 'Weapon.Longbow', 'Weapon.Mace', 'Weapon.Pistol', 'Weapon.Rifle', 'Weapon.Scepter', 'Weapon.Shield', 'Weapon.ShortBow', 'Weapon.Shortbow', 'Weapon.SmallBundle', 'Weapon.Spear', 'Weapon.Speargun', 'Weapon.Staff', 'Weapon.Sword', 'Weapon.Torch', 'Weapon.Toy', 'Weapon.ToyTwoHanded', 'Weapon.Trident', 'Weapon.Warhorn'] as const satisfies TranslationKey<TypeWithSubtype>[];

export const translations = {
  short: [...typeTranslationKeys.map((key) => `item.type.${key}` as const), ...subtypeTranslationKeys.map((key) => `item.type.short.${key}` as const)],
  type: typeTranslationKeys.map((key) => `item.type.${key}` as const),
  subtype: subtypeTranslationKeys.map(((key) => `item.type.${key}` as const)),
  long: [...typeTranslationKeys.map((key) => `item.type.${key}` as const), ...subtypeTranslationKeys.map(((key) => `item.type.${key}` as const))]
};
