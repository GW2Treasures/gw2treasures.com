import { CodeType } from 'gw2e-chat-codes/build/src/static';

declare module 'gw2e-chat-codes' {
  function decode(chatCode: string): false | {
    type: Exclude<CodeType, 'item' | 'objective' | 'build'>;
    id: number;
  } | {
    type: 'item';
    id: number;
    quantity: number;
    skin: undefined | number;
    upgrades: undefined | [number] | [number, number];
  } | {
    type: 'objective';
    id: string;
  } | {
    type: 'build';
    profession: number;
    specialization1: number;
    traitChoices1: number[];
    specialization2: number;
    traitChoices2: number[];
    specialization3: number;
    traitChoices3: number[];
    terrestrialHealSkill: number;
    terrestrialUtilitySkill1: number;
    terrestrialUtilitySkill2: number;
    terrestrialUtilitySkill3: number;
    terrestrialEliteSkill: number;
    aquaticHealSkill: number;
    aquaticUtilitySkill1: number;
    aquaticUtilitySkill2: number;
    aquaticUtilitySkill3: number;
    aquaticEliteSkill: number;
    terrestrialPet1: number | undefined;
    terrestrialPet2: number | undefined;
    aquaticPet1: number | undefined;
    aquaticPet2: number | undefined;
    terrestrialLegend1: number | undefined;
    terrestrialLegend2: number | undefined;
    aquaticLegend1: number | undefined;
    aquaticLegend2: number | undefined;
  };
}
