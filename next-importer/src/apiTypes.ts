
export type ApiItem = {
  chat_link: string;
  default_skin?: number;
  description?: string;
  details?: {
    apply_count?: number;
    attribute_adjustment?: number;
    bonuses?: string[];
    charges?: number;
    color_id?: number;
    damage_type?: "Choking" | "Physical" | "Ice" | "Fire" | "Lightning";
    defense?: number;
    description?: string;
    duration_ms?: number;
    extra_recipe_ids?: number[];
    flags?: string[];
    guild_upgrade_id?: number;
    icon?: string;
    infix_upgrade?: {
      attributes: {
        attribute: "Power" | "Precision" | "Toughness" | "Vitality" | "ConditionDamage" | "CritDamage" | "Healing" | "BoonDuration" | "ConditionDuration" | "AgonyResistance";
        modifier: number;
      }[];
      buff?: {
        description?: string;
        skill_id: number;
      };
      id: number;
    };
    infusion_slots?: {
      flags?: string[];
      item_id?: number;
    }[];
    infusion_upgrade_flags?: string[];
    max_power?: number;
    min_power?: number;
    minipet_id?: number;
    name?: "+50% Crafting Critical Chance Boost" | "Magic Find Boost" | "5% Damage Bonus" | "15% Speed Bonus" | "5% Damage Reduction" | "Healthful Rejuvenation" | "Utility Primer" | "Enhancement" | "Nourishment" | "Purity" | "Skale Venom" | "Revive Sickness" | "Active Kill Streak!" | "Sugar Rush" | "Gathering Boost" | "Underwater Swiftness" | "Metabolic Primer" | "50% WvW Experience Bonus" | "Celebration Bonus" | "50% Experience Bonus" | "Tigg's Swiftness" | "" | "Ghoul's Blessing" | "Feline Blessing" | "Pumpkin's Blessing" | "Mordrem Dissector" | "Poor Nourishment" | "Home-Cooked Nourishment" | "Item Booster" | "Experience Booster" | "Guild Crafting Boost" | "Guild Item Research" | "Anguished Tear of Alba" | "Guild WvW Experience Bonus" | "Guild PvP Reward Track Boost" | "Tangled Depths Bonus" | "Verdant Brink Bonus" | "Map Bonus Boost" | "Fractal Offensive" | "Guild Experience Boost" | "Auric Basin Bonus" | "Guild Karma Boost" | "Guild Gathering Boost" | "Fractal Mobility" | "Fractal Defensive" | "Winter's Blessing" | "Guild WvW Reward Track Boost" | "Black Lion Boost" | "Branded-Slaying Enhancement" | "Explorer Boost" | "Chatoyant Elixir" | "Fool's Enhancement";
    no_sell_or_sort?: boolean;
    recipe_id?: number;
    secondary_suffix_item_id?: "" | "24599" | "24615" | "24618" | "24600" | "24612" | "24570" | "24551" | "24630" | "24624" | "24560" | "70825" | "24561";
    size?: number;
    skins?: number[];
    stat_choices?: number[];
    suffix?: string;
    suffix_item_id?: number;
    type?: "Axe" | "SmallBundle" | "Hammer" | "Generic" | "Staff" | "Coat" | "Leggings" | "Boots" | "Helm" | "Shoulders" | "Gloves" | "HelmAquatic" | "LargeBundle" | "Immediate" | "Transmutation" | "Utility" | "Booze" | "Food" | "Default" | "Unlock" | "GiftBox" | "Amulet" | "Accessory" | "Ring" | "Trident" | "Scepter" | "Focus" | "ShortBow" | "Warhorn" | "Torch" | "LongBow" | "Pistol" | "Rifle" | "Speargun" | "Dagger" | "Sword" | "Mace" | "Shield" | "Greatsword" | "Harpoon" | "ContainerKey" | "Salvage" | "Halloween" | "ContractNpc" | "OpenUI" | "UpgradeRemoval" | "RentableContractNpc" | "Foraging" | "Logging" | "Mining" | "Gem" | "Sigil" | "Rune" | "AppearanceChange" | "UnlimitedConsumable" | "Toy" | "ToyTwoHanded" | "TeleportToFriend" | "Currency" | "RandomUnlock" | "MountRandomUnlock" | "Bait" | "Lure";
    unlock_type?: "CraftingRecipe" | "Content" | "BagSlot" | "BankTab" | "Dye" | "CollectibleCapacity" | "Outfit" | "GliderSkin" | "SharedSlot" | "Champion" | "Minipet" | "Ms" | "GearLoadoutTab" | "BuildLibrarySlot" | "BuildLoadoutTab" | "JadeBotSkin";
    vendor_ids?: number[];
    weight_class?: "Clothing" | "Light" | "Medium" | "Heavy";
  };
  flags: string[];
  game_types: string[];
  icon?: string;
  id: number;
  level: number;
  name: string;
  rarity: "Basic" | "Fine" | "Masterwork" | "Exotic" | "Rare" | "Legendary" | "Junk" | "Ascended";
  restrictions: string[];
  type: "Weapon" | "Consumable" | "Back" | "Armor" | "Trophy" | "Container" | "Gizmo" | "Bag" | "CraftingMaterial" | "Trinket" | "Tool" | "MiniPet" | "UpgradeComponent" | "Gathering" | "Key" | "JadeTechModule" | "PowerCore";
  upgrades_from?: {
    item_id: number;
    upgrade: "Infusion" | "Attunement";
  }[];
  upgrades_into?: {
    item_id: number;
    upgrade: "Infusion" | "Attunement";
  }[];
  vendor_value: number;
};
