import type { RaidEncounterId, RaidWingEncounterId } from './index';

const set1 = [
  'shiverpeaks_pass',
  'voice_claw',
  'fraenir_of_jormag',
  'gorseval',
  'cairn',
  'mursaat_overseer',
] satisfies (RaidWingEncounterId | RaidEncounterId)[];

const set2 = [
  'aetherblade',
  'sabir',
  'whisper_of_jormag',
  'vale_guardian',
  'cosmic_observatory',
  'cold_war',
  'boneskinner',
  'sabetha',
  'xunlai_jade_junkyard',
  'temple_of_febe',
  'keep_construct',
  'guardians_glade'
] satisfies (RaidWingEncounterId | RaidEncounterId)[];

const set3 = [
  'slothasor',
  'matthias',
  'xera',
  'samarog',
  'conjured_amalgamate',
  'twin_largos',
  'decima',
  'adina',
  'olc',
  'ura',
  'kaineng_overlook',
  'deimos'
] satisfies (RaidWingEncounterId | RaidEncounterId)[];

const set4 = [
  'qadim',
  'qadim_the_peerless',
  'soulless_horror',
  'harvest_temple',
  'voice_in_the_void',
  'greer'
] satisfies (RaidWingEncounterId | RaidEncounterId)[];

export function getDailySet(dayOfYearIndex: number) {
  return [
    set1[dayOfYearIndex % set1.length],
    set2[dayOfYearIndex % set2.length],
    set3[dayOfYearIndex % set3.length],
    set4[dayOfYearIndex % set4.length]
  ] as const;
}

export const dailyAchievementId: Record<ReturnType<typeof getDailySet>[number], number> = {
  olc: 9138,
  vale_guardian: 9126,
  gorseval: 9122,
  sabetha: 9185,
  slothasor: 9135,
  matthias: 9160,
  keep_construct: 9163,
  xera: 9107,
  cairn: 9109,
  mursaat_overseer: 9192,
  samarog: 9103,
  deimos: 9176,
  soulless_horror: 9146,
  voice_in_the_void: 9191,
  conjured_amalgamate: 9119,
  twin_largos: 9162,
  qadim: 9201,
  adina: 9145,
  sabir: 9127,
  qadim_the_peerless: 9124,
  shiverpeaks_pass: 9121,
  voice_claw: 9175,
  fraenir_of_jormag: 9139,
  boneskinner: 9197,
  whisper_of_jormag: 9131,
  cold_war: 9115,
  aetherblade: 9153,
  xunlai_jade_junkyard: 9196,
  kaineng_overlook: 9179,
  harvest_temple: 9168,
  cosmic_observatory: 9155,
  temple_of_febe: 9134,
  greer: 9161,
  decima: 9137,
  ura: 9189,
  guardians_glade: 9158
};
