export const currencyCategories = {
  general: [
    4, // Gem
    1, // Coin
    2, // Karma
    23, // Spirit Shard
    3, // Laurel
    16, // Guild Commendation
    18, // Transmutation Charge
    63, // Astral Acclaim
  ],
  competitive: [
    30, // PvP League Ticket
    15, // Badge of Honor
    26, // WvW Skirmish Claim Ticket
    31, // Proof of Heroics
    36, // Testimony of Desert Heroics
    65, // Testimony of Jade Heroics
    33, // Ascended Shards of Glory
  ],
  map: [
    25, // Geode
    27, // Bandit Crest
    19, // Airship Part
    22, // Lump of Aurillium
    20, // Ley Line Crystal
    29, // Provisioner Token
    32, // Unbound Magic
    34, // Trade Contract
    35, // Elegy Mosaic
    45, // Volatile Magic
    47, // Racing Medallion
    50, // Festival Token
    57, // Blue Prophet Shard
    58, // War Supplies
    60, // Tyrian Defense Seal
    67, // Canach Coins
    72, // Static Charge
    73, // Pinch of Stardust
    75, // Calcified Gasp
    76, // Ursus Oblige
    28, // Magnetite Shard
    70, // Legendary Insight
    53, // Green Prophet Shard
    77, // Gaeting Crystal
  ],
  key: [
    43, // Zephyrite Lockpick
    41, // Pact Crowbar
    37, // Exalted Key
    42, // Vial of Chak Acid
    38, // Machete
    44, // Trader's Key
    49, // Mistborn Key
    51, // Cache Key
    54, // Blue Prophet Crystal
    71, // Jade Miner's Keycard
    40, // Bandit Skeleton Key
  ],
  dungeon: [
    7, // Fractal Relic
    24, // Pristine Fractal Relic
    69, // Tales of Dungeon Delving
    59, // Unstable Fractal Essence
  ],
  blacklion: [
    4, // Gem
    18, // Transmutation Charge
  ],
  historic: [
    39, // Gaeting Crystal
    55, // Green Prophet Crystal
    52, // Red Prophet Shard
    56, // Red Prophet Crystal
    5, // Ascalonian Tear
    9, // Seal of Beetletun
    11, // Deadly Bloom
    10, // Manifesto of the Moletariate
    13, // Flame Legion Charr Carving
    12, // Symbol of Koda
    14, // Knowledge Crystal
    6, // Shard of Zhaitan
    74, // [empty name, icon of Astral Acclaim]
  ]
};

export type CurrencyCategoryName = keyof typeof currencyCategories;

export const currencyCategoryById: Record<number, (CurrencyCategoryName)[]> = {};

for(const [category, ids] of Object.entries(currencyCategories) as [CurrencyCategoryName, number[]][]) {
  for(const id of ids) {
    if(!currencyCategoryById[id]) {
      currencyCategoryById[id] = [];
    }
    currencyCategoryById[id].push(category);
  }
}
