/* eslint-disable @next/next/no-img-element */
'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { TranslationSubset } from '@/lib/translate';
import type { CharacterSab, CharacterSabSong, CharacterSabUnlock, CharacterSabZoneMode } from '@gw2api/types/data/character-sab';
import { Scope } from '@gw2me/client';
import { groupById } from '@gw2treasures/helper/group-by';
import { Icon, type IconName } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { type FC } from 'react';
import styles from './page.module.css';

import purseImg from './purse.png';
import toteBagImg from './tote_bag.png';

export const requiredScopes = [
  Scope.GW2_Account,
  Scope.GW2_Characters,
];

export interface SabAccountsProps {
  translations: TranslationSubset<
    | 'festival.super-adventure.sab.character'
    | 'festival.super-adventure.sab.upgrades'
    | 'festival.super-adventure.sab.songs'
    | 'festival.super-adventure.sab.mode.infantile'
    | 'festival.super-adventure.sab.mode.normal'
    | 'festival.super-adventure.sab.mode.tribulation'
    | 'festival.super-adventure.sab.unlock.chain_stick'
    | 'festival.super-adventure.sab.unlock.slingshot'
    | 'festival.super-adventure.sab.unlock.whip'
    | 'festival.super-adventure.sab.unlock.mini_bomb'
    | 'festival.super-adventure.sab.unlock.mega_bomb'
    | 'festival.super-adventure.sab.unlock.candle'
    | 'festival.super-adventure.sab.unlock.torch'
    | 'festival.super-adventure.sab.unlock.wooden_whistle'
    | 'festival.super-adventure.sab.unlock.digger'
    | 'festival.super-adventure.sab.unlock.nice_scoop'
    | 'festival.super-adventure.sab.unlock.glove_of_wisdom'
    | 'festival.super-adventure.sab.unlock.bauble_purse'
    | 'festival.super-adventure.sab.unlock.bauble_tote_bag'
    | 'festival.super-adventure.sab.unlock.moto_breath'
    | 'festival.super-adventure.sab.unlock.moto_finger'
    | 'festival.super-adventure.sab.unlock.health_vessel_1'
    | 'festival.super-adventure.sab.unlock.health_vessel_2'
    | 'festival.super-adventure.sab.unlock.medium_health_potion'
    | 'festival.super-adventure.sab.song.secret_song'
    | 'festival.super-adventure.sab.song.gatekeeper_lullaby'
    | 'festival.super-adventure.sab.song.shatter_serenade'
  >,
}

export const SabAccounts: FC<SabAccountsProps> = ({ translations }) => {
  return (
    <Gw2Accounts requiredScopes={requiredScopes}>
      {(accounts) => accounts.map((account) => <SabAccount key={account.id} account={account} translations={translations}/>)}
    </Gw2Accounts>
  );
};

interface SabAccountProps extends SabAccountsProps {
  account: Gw2Account,
}

const SabAccount: FC<SabAccountProps> = ({ account, translations }) => {
  const sab = useSubscription('sab', account.id);

  return (
    <>
      <Headline id={account.id}>
        <Gw2AccountName account={account}/>
      </Headline>

      {sab.loading ? <Skeleton/> : sab.error ? 'error' : (
        <SabAccountTable data={sab.data} translations={translations}/>
      )}
    </>
  );
};

interface SabAccountTableProps extends SabAccountsProps {
  data: Record<string, CharacterSab>,
}

const SabAccountTable: FC<SabAccountTableProps> = ({ data, translations }) => {
  return (
    <Table>
      <thead>
        <tr>
          <Table.HeaderCell>{translations['festival.super-adventure.sab.character']}</Table.HeaderCell>
          <Table.HeaderCell small>W1 / Z1</Table.HeaderCell>
          <Table.HeaderCell small>W1 / Z2</Table.HeaderCell>
          <Table.HeaderCell small>W1 / Z3</Table.HeaderCell>
          <Table.HeaderCell small>W2 / Z1</Table.HeaderCell>
          <Table.HeaderCell small>W2 / Z2</Table.HeaderCell>
          <Table.HeaderCell small>W2 / Z3</Table.HeaderCell>
          <Table.HeaderCell small>{translations['festival.super-adventure.sab.upgrades']}</Table.HeaderCell>
          <Table.HeaderCell>{translations['festival.super-adventure.sab.songs']}</Table.HeaderCell>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([character, sab]) => {
          const zones = sabZoneLookup(sab);
          return (
            <tr key={character}>
              <th>{character}</th>
              <SabAccountTableZoneCell mode={zones[0]} translations={translations}/>
              <SabAccountTableZoneCell mode={zones[1]} translations={translations}/>
              <SabAccountTableZoneCell mode={zones[2]} translations={translations}/>
              <SabAccountTableZoneCell mode={zones[3]} translations={translations}/>
              <SabAccountTableZoneCell mode={zones[4]} translations={translations}/>
              <SabAccountTableZoneCell mode={zones[5]} translations={translations}/>
              <SabAccountTableUnlocksCell upgrades={sab.unlocks} translations={translations}/>
              <SabAccountTableSongsCell songs={sab.songs} translations={translations}/>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

interface SabAccountTableZoneCellProps extends SabAccountsProps {
  mode: CharacterSabZoneMode | undefined,
}

const SabAccountTableZoneCell: FC<SabAccountTableZoneCellProps> = ({ mode, translations }) => (
  <ProgressCell progress={mode ? 1 : 0} color={mode ? sabModes[mode].color : undefined}>
    {mode && (
      <Tip tip={translations[`festival.super-adventure.sab.mode.${mode}`]}>
        <Icon icon={sabModes[mode].icon}/>
      </Tip>
    )}
  </ProgressCell>
);

const sabModes: Record<CharacterSabZoneMode, { icon: IconName, color: 'red' | 'blue' | undefined }> = {
  infantile: { icon: 'baby', color: 'blue' },
  normal: { icon: 'checkmark', color: undefined },
  tribulation: { icon: 'thunder-cloud', color: 'red' },
};

function sabZoneLookup(sab: CharacterSab) {
  const zones: CharacterSabZoneMode[] = [];

  for(const zone of sab.zones) {
    const index = (zone.world - 1) * 3 + (zone.zone - 1);
    zones[index] = (!zones[index] || zones[index][0] < zone.mode[0]) ? zone.mode : zones[index];
  }

  return zones;
}


interface SabAccountTableUnlocksCellProps extends SabAccountsProps {
  upgrades: CharacterSabUnlock[],
}

const SabAccountTableUnlocksCell: FC<SabAccountTableUnlocksCellProps> = ({ upgrades, translations }) => {
  const unlocks = groupById(upgrades);

  return (
    <td>
      <div className={styles.upgrades}>
        {allUpgrades.map((upgrade) => (
          <Tip key={upgrade.id} tip={translations[`festival.super-adventure.sab.unlock.${upgrade.name}`]}>
            <span style={!unlocks.has(upgrade.id) ? { opacity: .5, filter: 'grayscale(.9)' } : undefined}>
              {upgrade.iconId ? (
                <EntityIcon type={upgrade.iconType as 'skill'} icon={{ id: upgrade.iconId }} size={32}/>
              ) : upgrade.id === 24 ? (
                <img width={32} height={32} alt="" src={purseImg.src} style={{ imageRendering: 'pixelated' }}/>
              ) : upgrade.id === 25 ? (
                <img width={32} height={32} alt="" src={toteBagImg.src} style={{ imageRendering: 'pixelated' }}/>
              ) : null}
            </span>
          </Tip>
        ))}
      </div>
    </td>
  );
};

const allUpgrades = [
  { id: 1, iconId: 563502, iconType: 'skill', name: 'chain_stick' as const },
  { id: 3, iconId: 563481, iconType: 'skill', name: 'slingshot' as const },
  { id: 6, iconId: 563482, iconType: 'skill', name: 'whip' as const },
  { id: 9, iconId: 563486, iconType: 'skill', name: 'mini_bomb' as const },
  { id: 10, iconId: 563487, iconType: 'skill', name: 'mega_bomb' as const },
  { id: 2, iconId: 563489, iconType: 'skill', name: 'candle' as const },
  { id: 13, iconId: 563490, iconType: 'skill', name: 'torch' as const },
  { id: 15, iconId: 563494, iconType: 'skill', name: 'wooden_whistle' as const },
  { id: 18, iconId: 563478, iconType: 'skill', name: 'digger' as const },
  { id: 19, iconId: 563479, iconType: 'skill', name: 'nice_scoop' as const },
  { id: 21, iconId: 563497, iconType: 'skill', name: 'glove_of_wisdom' as const },
  { id: 27, iconId: 563519, iconType: 'skill', name: 'moto_breath' as const },
  { id: 28, iconId: 563520, iconType: 'skill', name: 'moto_finger' as const },
  { id: 31, iconId: 547841, name: 'health_vessel_1' as const },
  { id: 32, iconId: 547841, name: 'health_vessel_2' as const },
  { id: 34, iconId: 563522, iconType: 'skill', name: 'medium_health_potion' as const },
  { id: 24, name: 'bauble_purse' as const },
  { id: 25, name: 'bauble_tote_bag' as const },
];


interface SabAccountTableSongsCellProps extends SabAccountsProps {
  songs: CharacterSabSong[],
}

const SabAccountTableSongsCell: FC<SabAccountTableSongsCellProps> = ({ songs, translations }) => {
  const unlocks = groupById(songs);

  const tip = (
    <ul className={styles.songsTip}>
      <li className={!unlocks.has(1) ? styles.songMissing : undefined}><Icon icon={unlocks.has(1) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.secret_song']}</li>
      <li className={!unlocks.has(2) ? styles.songMissing : undefined}><Icon icon={unlocks.has(2) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.gatekeeper_lullaby']}</li>
      <li className={!unlocks.has(3) ? styles.songMissing : undefined}><Icon icon={unlocks.has(3) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.shatter_serenade']}</li>
    </ul>
  );

  return (
    <ProgressCell progress={songs.length / 3}>
      <Tip tip={tip}>
        <span style={{ whiteSpace: 'nowrap' }}>{songs.length} / 3</span>
      </Tip>
    </ProgressCell>
  );
};
