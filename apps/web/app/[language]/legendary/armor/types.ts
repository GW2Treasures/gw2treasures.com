import type { Weight } from '@/lib/types/weight';

export type ArmorWeight = Exclude<Weight, 'Clothing'>;

export type ArmorSlot =
 | 'Helm'
 | 'Shoulders'
 | 'Coat'
 | 'Gloves'
 | 'Leggings'
 | 'Boots'
 | 'HelmAquatic';
