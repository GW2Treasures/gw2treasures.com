export interface DungeonPath {
  id: DungeonPathId,
  type: 'Story' | 'Explorable',
  level: number,
  rewards: {
    coins: number,
    talesOfDungeonDelving?: number,
  },
}
export interface Dungeon {
  id: DungeonId,
  icon: string,
  paths: DungeonPath[],
}

export type DungeonId = 'ascalonian_catacombs' | 'caudecus_manor' | 'twilight_arbor' | 'sorrows_embrace' | 'citadel_of_flame' | 'honor_of_the_waves' | 'crucible_of_eternity' | 'ruined_city_of_arah';
export type DungeonPathId =
  | 'ac_story' | 'hodgins' | 'detha' | 'tzark'
  | 'cm_story' | 'asura' | 'seraph' | 'butler'
  | 'ta_story' | 'leurent' | 'vevina' | 'aetherpath'
  | 'se_story' | 'fergg' | 'rasalov' | 'koptev'
  | 'cof_story' | 'ferrah' | 'magg' | 'rhiannon'
  | 'hotw_story' | 'butcher' | 'plunderer' | 'zealot'
  | 'coe_story' | 'submarine' | 'teleporter' | 'front_door'
  | 'arah_story' | 'jotun' | 'mursaat' | 'forgotten' | 'seer';

export const dungeons: Dungeon[] = [{
  id: 'ascalonian_catacombs',
  icon: 'https://render.guildwars2.com/file/2AA9C0B030BE152B915E0174D7F0495FDA711C54/619318.png',
  paths: [{
    id: 'ac_story',
    type: 'Story',
    level: 30,
    rewards: { coins: 6300 },
  }, {
    id: 'hodgins',
    type: 'Explorable',
    level: 35,
    rewards: { coins: 5000 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'detha',
    type: 'Explorable',
    level: 35,
    rewards: { coins: 5000 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'tzark',
    type: 'Explorable',
    level: 35,
    rewards: { coins: 5000 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'caudecus_manor',
  icon: 'https://render.guildwars2.com/file/C97B0607A6DB1FA1469D1DBBF2F107A057F8A313/619322.png',
  paths: [{
    id: 'cm_story',
    type: 'Story',
    level: 40,
    rewards: { coins: 6300 },
  }, {
    id: 'asura',
    type: 'Explorable',
    level: 45,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'seraph',
    type: 'Explorable',
    level: 45,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'butler',
    type: 'Explorable',
    level: 45,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'twilight_arbor',
  icon: 'https://render.guildwars2.com/file/F6F4F39212AF3324223D73BAA807026BD863997C/619324.png',
  paths: [{
    id: 'ta_story',
    type: 'Story',
    level: 50,
    rewards: { coins: 6300 },
  }, {
    id: 'leurent',
    type: 'Explorable',
    level: 55,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'vevina',
    type: 'Explorable',
    level: 55,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'aetherpath',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 6600 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'sorrows_embrace',
  icon: 'https://render.guildwars2.com/file/B83A4ED528FC237D4D1862CDD0250B773EAB36AA/619323.png',
  paths: [{
    id: 'se_story',
    type: 'Story',
    level: 60,
    rewards: { coins: 6300 },
  }, {
    id: 'fergg',
    type: 'Explorable',
    level: 65,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'rasalov',
    type: 'Explorable',
    level: 65,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'koptev',
    type: 'Explorable',
    level: 65,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'citadel_of_flame',
  icon: 'https://render.guildwars2.com/file/310CA245DBF61A54BD0C5D5361E26F0821FCAAFD/619326.png',
  paths: [{
    id: 'cof_story',
    type: 'Story',
    level: 70,
    rewards: { coins: 6300 },
  }, {
    id: 'ferrah',
    type: 'Explorable',
    level: 75,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'magg',
    type: 'Explorable',
    level: 75,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'rhiannon',
    type: 'Explorable',
    level: 75,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'honor_of_the_waves',
  icon: 'https://render.guildwars2.com/file/2B9E2BC9D5D080C54C17E27CECACEFFC0D64EE22/619325.png',
  paths: [{
    id: 'hotw_story',
    type: 'Story',
    level: 76,
    rewards: { coins: 6300 },
  }, {
    id: 'butcher',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'plunderer',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'zealot',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'crucible_of_eternity',
  icon: 'https://render.guildwars2.com/file/37CCE672250A3170B71760949C4C9C9B186517B1/619327.png',
  paths: [{
    id: 'coe_story',
    type: 'Story',
    level: 78,
    rewards: { coins: 6300 },
  }, {
    id: 'submarine',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'teleporter',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'front_door',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 3500 + 2600, talesOfDungeonDelving: 100 },
  }]
}, {
  id: 'ruined_city_of_arah',
  icon: 'https://render.guildwars2.com/file/06083C4F7321512918E23D57B999F04E94C8D9A3/619319.png',
  paths: [{
    id: 'arah_story',
    type: 'Story',
    level: 80,
    rewards: { coins: 6300 },
  }, {
    id: 'jotun',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 10000 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'mursaat',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 15000 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'forgotten',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 5000 + 2600, talesOfDungeonDelving: 100 },
  }, {
    id: 'seer',
    type: 'Explorable',
    level: 80,
    rewards: { coins: 10000 + 2600, talesOfDungeonDelving: 100 },
  }]
}];
