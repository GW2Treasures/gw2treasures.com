export type Type = 'Armor' | 'Back' | 'Bag' | 'Consumable' | 'Container' | 'CraftingMaterial' | 'Gathering' | 'Gizmo' | 'JadeTechModule' | 'Key' | 'MiniPet' | 'PowerCore' | 'Relic' | 'Tool' | 'Trait' | 'Trinket' | 'Trophy' | 'UpgradeComponent' | 'Weapon';
export type SubType<T extends Type> =
  T extends 'Armor' ? 'Boots' | 'Coat' | 'Gloves' | 'Helm' | 'HelmAquatic' | 'Leggings' | 'Shoulders' :
  T extends 'Back' ? null :
  T extends 'Bag' ? null :
  T extends 'Consumable' ? 'AppearanceChange' | 'Booze' | 'ContractNpc' | 'Currency' | 'Food' | 'Generic' | 'Halloween' | 'Immediate' | 'MountRandomUnlock' | 'RandomUnlock' | 'TeleportToFriend' | 'Transmutation' | 'Unlock' | 'UpgradeRemoval' | 'Utility' :
  T extends 'Container' ? 'Default' | 'GiftBox' | 'Immediate' | 'OpenUI' :
  T extends 'CraftingMaterial' ? null :
  T extends 'Gathering' ? 'Bait' | 'Foraging' | 'Logging' | 'Lure' | 'Mining' | 'Fishing' :
  T extends 'Gizmo' ? 'ContainerKey' | 'Default' | 'RentableContractNpc' | 'UnlimitedConsumable' :
  T extends 'JadeTechModule' ? null :
  T extends 'Key' ? null :
  T extends 'MiniPet' ? null :
  T extends 'PowerCore' ? null :
  T extends 'Relic' ? null :
  T extends 'Tool' ? 'Salvage' :
  T extends 'Trait' ? null :
  T extends 'Trinket' ? 'Accessory' | 'Amulet' | 'Ring' :
  T extends 'Trophy' ? null :
  T extends 'UpgradeComponent' ? 'Default' | 'Gem' | 'Rune' | 'Sigil' :
  T extends 'Weapon' ? 'Axe' | 'Dagger' | 'Focus' | 'Greatsword' | 'Hammer' | 'Harpoon' | 'LargeBundle' | 'LongBow' | 'Longbow' | 'Mace' | 'Pistol' | 'Rifle' | 'Scepter' | 'Shield' | 'ShortBow' | 'Shortbow' | 'SmallBundle' | 'Spear' | 'Speargun' | 'Staff' | 'Sword' | 'Torch' | 'Toy' | 'ToyTwoHanded' | 'Trident' | 'Warhorn' :
  never;

export type TypeWithSubtype = 'Armor' | 'Consumable' | 'Container' | 'Gathering' | 'Gizmo' | 'Tool' | 'Trinket' | 'UpgradeComponent' | 'Weapon';
export type TypeWithoutSubtype = Exclude<Type, TypeWithSubtype>;
