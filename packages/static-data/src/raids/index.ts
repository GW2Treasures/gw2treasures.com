export interface Raid {
  id: string,
  wings: Wing[],
}
export interface Wing {
  id: string,
  events: Event[],
  achievementCategoryId: number,
}
export interface Event {
  id: string,
  type: 'Boss' | 'Checkpoint',
  icon?: string,
}

export type RaidId = typeof raids[number]['id'];
export type WingId = typeof raids[number]['wings'][number]['id'];
export type EncounterId = typeof raids[number]['wings'][number]['events'][number]['id'];

export const raids = [{
  id: 'forsaken_thicket',
  wings: [{
    id: 'spirit_vale',
    achievementCategoryId: 124,
    events: [{
      id: 'vale_guardian',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/1CCB9B3880B062465F9F5834F04739289AF27BBA/1301792.png',
    }, {
      id: 'spirit_woods',
      type: 'Checkpoint',
      icon: 'https://render.guildwars2.com/file/1CA7D86C2AFC5975410AEE0B01CADF45A255004E/1301728.png',
    }, {
      id: 'gorseval',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/E5074A6E5CE552A9231195202B45D5DA2C1A585E/1301787.png',
    }, {
      id: 'sabetha',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/1C96C03C385529A818E9E14ED7BB7E47F10154F5/1301795.png',
    }]
  }, {
    id: 'salvation_pass',
    achievementCategoryId: 134,
    events: [{
      id: 'slothasor',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/2370FE955AC49D38B99F2592F629D2B544BABBD2/1377392.png',
    }, {
      id: 'bandit_trio',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/15945F03F94119E344DDC921D34FAF49D85FAE95/1377390.png',
    }, {
      id: 'matthias',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/EBAFC4EA9C80F6D66AD9A427E15918E0172A476F/1377391.png',
    }]
  }, {
    id: 'stronghold_of_the_faithful',
    achievementCategoryId: 138,
    events: [{
      id: 'escort',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/433A4E66794240AD463941F868754BB46D245020/1451172.png',
    }, {
      id: 'keep_construct',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/E87C6B0BB4C1D93231A4DB7CBE91157516580A3E/1451173.png',
    }, {
      id: 'twisted_castle',
      type: 'Checkpoint',
      icon: 'https://render.guildwars2.com/file/62C547BC593942603192793F44031F22F531624A/1451294.png',
    }, {
      id: 'xera',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/551509B3B91270BFF016C020D2F9D99B550F93AA/1451174.png',
    }]
  }]
}, {
  id: 'bastion_of_the_penitent',
  wings: [{
    id: 'bastion_of_the_penitent',
    achievementCategoryId: 155,
    events: [{
      id: 'cairn',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/0863ADC609086A5E5F6C031DDC1766033432250C/1633961.png',
    }, {
      id: 'mursaat_overseer',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/05FCD9D1B4959A051EEC3B160F0802FAB40C2619/1633963.png',
    }, {
      id: 'samarog',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/9645BE1925D1AC3E7177C99B740078F09EA5A739/1633967.png',
    }, {
      id: 'deimos',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/03E57D1019181CE015C09BDA0601B7D34ECD3841/1633966.png',
    }]
  }]
}, {
  id: 'hall_of_chains',
  wings: [{
    id: 'hall_of_chains',
    achievementCategoryId: 195,
    events: [{
      id: 'soulless_horror',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/4FE00D4F52D0D8340CCCBAE824B7FD0109BE7E33/1894936.png',
    }, {
      id: 'river_of_souls',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/5276C15002466D2B7D48094396D3117762E12E6C/1894803.png',
    }, {
      id: 'statues_of_grenth',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/BE1651A4BBDAD1E3FE6CC1986A26029FBDE3AE39/1894799.png',
    }, {
      id: 'voice_in_the_void',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/5C4FEBC890B4D9D2D6A96E4837CD4C0CFA605AB7/1894937.png',
    }]
  }]
}, {
  id: 'mythwright_gambit',
  wings: [{
    id: 'mythwright_gambit',
    achievementCategoryId: 215,
    events: [{
      id: 'conjured_amalgamate',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/69E33529F8C4A97E5D9D78EA6D06F90EAA95CED9/2039286.png',
    }, {
      id: 'twin_largos',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/453C959040B6AF7F639FDD78367AF39FD7C73246/2038614.png',
    }, {
      id: 'qadim',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/64ED38CE4F549E573DA3CE641A15BCB3C4FB48B3/2038618.png',
    }]
  }]
}, {
  id: 'the_key_of_ahdashim',
  wings: [{
    id: 'the_key_of_ahdashim',
    achievementCategoryId: 229,
    events: [{
      id: 'gate',
      type: 'Checkpoint',
      icon: 'https://render.guildwars2.com/file/A9AEBDAAA1D94F9DA41A4714C7464758D9EE3ED7/2155913.png',
    }, {
      id: 'adina',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/EAF501CC3C05CAD8C1BB474133B9F89925400EF3/1766806.png',
    }, {
      id: 'sabir',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/9B52A257E0ED4B3F1992ADE60D6A071ED4D5BBAB/1766790.png',
    }, {
      id: 'qadim_the_peerless',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/640241E807BF6D14447406C934F5D6FE144A0A4E/2155914.png',
    }]
  }]
}, {
  id: 'mount_balrior',
  wings: [{
    id: 'mount_balrior',
    achievementCategoryId: 438,
    events: [{
      id: 'camp',
      type: 'Checkpoint',
      icon: 'https://render.guildwars2.com/file/A3B30FADB2FA0DE27C5163DB486232E1EECA52B0/3441854.png',
    }, {
      id: 'greer',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/07ABDD24073CBC02DB092FE80BBD4E58CBA3EC3F/3441685.png',
    }, {
      id: 'decima',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/75E6319680031EFBA5EDE8060F03DE2321F3184F/3375072.png',
    }, {
      id: 'ura',
      type: 'Boss',
      icon: 'https://render.guildwars2.com/file/E8EBB7BA0819BFECD3D24F95126A2DED6F4A6B54/3441855.png',
    }]
  }]
}] as const satisfies Raid[];
