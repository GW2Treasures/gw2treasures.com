export interface ConversionRate {
  produced: number;
  required: number;
}

export type RefinedCosts = [
  /** Conversion rate with no efficiency upgrades purchased  */
  base: ConversionRate,
  /** Conversion rate with 1 efficiency upgrade */
  efficiency1: ConversionRate,
  /** Conversion rate with 2 efficiency upgrades*/
  efficiency2: ConversionRate
];

export type RefinedSources = Record<number, RefinedCosts>;
export type Efficiency = 0 | 1 | 2;
export type Material = 'metal' | 'wood' | 'fiber';
export const materials: Material[] = ['metal', 'wood', 'fiber'];

const standardRate = (base: number): RefinedCosts => [
  { produced: 1, required: base },
  { produced: 1, required: Math.floor(base / 2) },
  base >= 4
    ? { produced: 1, required: Math.floor(base / 4) }
    : { produced: 2, required: Math.floor(base / 2) },
];

export const data: Record<Material, { itemId: number, sources: RefinedSources }> = {
  wood: {
    itemId: 103049,
    sources: {
      19723: standardRate(20),
      19726: standardRate(12),
      19727: standardRate(4),
      19724: standardRate(4),
      19722: standardRate(4),
      19725: standardRate(2),
    }
  },

  metal: {
    itemId: 102205,
    sources: {
      19702: standardRate(2),
      19697: standardRate(8),
      19700: standardRate(4),
      19701: standardRate(2),
      19703: standardRate(20),
      19698: standardRate(8),
      // Iron Ore
      19699: [
        { produced: 2, required: 4 },
        { produced: 2, required: 2 },
        { produced: 1, required: 1 },
      ],
    }
  },

  fiber: {
    itemId: 102306,
    sources: {
      12246: standardRate(4),
      36731: standardRate(20),
      12330: standardRate(8),
      12544: standardRate(4),
      12162: standardRate(48),
      73113: standardRate(4),
      12238: standardRate(2),
      12255: standardRate(8),
      12538: standardRate(32),
      12545: standardRate(2),
      12334: standardRate(13),
      12547: standardRate(2),
      12243: standardRate(2),
      12248: standardRate(4),
      12511: standardRate(28),
      12537: standardRate(4),
      73096: standardRate(4),
      12332: standardRate(40),
      12508: standardRate(28),
      // Onion
      12142: [
        { produced: 1, required: 4 },
        { produced: 1, required: 1 },
        { produced: 2, required: 1 },
      ],
      12147: standardRate(4),
      12535: standardRate(4),
      73504: standardRate(24),
      12336: standardRate(40),
      66524: standardRate(24),
      12241: standardRate(4),
      12331: standardRate(8),
      12504: standardRate(4),
      12532: standardRate(32),
      82866: standardRate(4),
      12341: standardRate(32),
      12254: standardRate(2),
      // Potato
      12135: [
        { produced: 1, required: 8 },
        { produced: 1, required: 8 },
        { produced: 1, required: 4 },
      ],
      12134: standardRate(4),
      12512: standardRate(28),
      12509: standardRate(2),
      12335: standardRate(4),
      66522: standardRate(24),
      12253: standardRate(4),
      12163: standardRate(4),
      12546: standardRate(16),
      12536: standardRate(28),
      12510: standardRate(16),
      12333: standardRate(4),
      12534: standardRate(4),
      12247: standardRate(32),
      12236: standardRate(2),
      12505: standardRate(4),
      12144: standardRate(8),
      12342: standardRate(8),
      74090: standardRate(2),
      12161: standardRate(60),
      12506: standardRate(4),
      12234: standardRate(2),
      12533: standardRate(24),
      12128: standardRate(4),
      12329: standardRate(32),
      12507: standardRate(28),
      12244: standardRate(40),
    }
  }
};

export const refinedMaterialItemIds = [
  data.fiber.itemId,
  data.metal.itemId,
  data.wood.itemId
];
