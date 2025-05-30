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
import { groupById } from '@gw2treasures/helper/group-by';
import { Icon, type IconName } from '@gw2treasures/ui';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { useState, type FC } from 'react';
import { requiredScopes } from '../helper';
import styles from './page.module.css';

import purseImg from './purse.png';
import toteBagImg from './tote_bag.png';
import backpackImg from './backpack.png';
import questionmarkImg from './questionmark.png';

export interface SabAccountsProps {
  translations: TranslationSubset<
    | 'festival.super-adventure.sab.hideEmpty'
    | 'festival.super-adventure.sab.character'
    | 'festival.super-adventure.sab.upgrades'
    | 'festival.super-adventure.sab.songs'
    | 'festival.super-adventure.sab.mode.infantile'
    | 'festival.super-adventure.sab.mode.normal'
    | 'festival.super-adventure.sab.mode.tribulation'
    | 'festival.super-adventure.sab.unlock.chain_stick'
    | 'festival.super-adventure.sab.unlock.slingshot'
    | 'festival.super-adventure.sab.unlock.bow'
    | 'festival.super-adventure.sab.unlock.whip'
    | 'festival.super-adventure.sab.unlock.boomerang'
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
    | 'festival.super-adventure.sab.unlock.bauble_backpack'
    | 'festival.super-adventure.sab.unlock.moto_breath'
    | 'festival.super-adventure.sab.unlock.moto_finger'
    | 'festival.super-adventure.sab.unlock.health_vessel_1'
    | 'festival.super-adventure.sab.unlock.health_vessel_2'
    | 'festival.super-adventure.sab.unlock.medium_health_potion'
    | 'festival.super-adventure.sab.unlock.missingInApi'
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
  const [hideEmpty, setHideEmpty] = useState(false);

  return (
    <>
      <Headline id={account.id} actions={<Checkbox checked={hideEmpty} onChange={setHideEmpty}>{translations['festival.super-adventure.sab.hideEmpty']}</Checkbox>}>
        <Gw2AccountName account={account}/>
      </Headline>

      {sab.loading ? <Skeleton/> : sab.error ? 'error' : (
        <SabAccountTable data={sab.data} hideEmpty={hideEmpty} translations={translations}/>
      )}
    </>
  );
};

interface SabAccountTableProps extends SabAccountsProps {
  data: Record<string, CharacterSab>,
  hideEmpty: boolean,
}

const SabAccountTable: FC<SabAccountTableProps> = ({ data, hideEmpty, translations }) => {
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
          <th className={styles.songColumn}>{translations['festival.super-adventure.sab.songs']}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([character, sab]) => {
          if(hideEmpty && sab.zones.length + sab.unlocks.length + sab.songs.length === 0) {
            return null;
          }

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

  const missingInApi = <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{translations['festival.super-adventure.sab.unlock.missingInApi']}</div>;

  return (
    <td>
      <div className={styles.upgrades}>
        {allUpgrades.map((upgrade) => (
          <Tip key={upgrade.id} tip={<>{translations[`festival.super-adventure.sab.unlock.${upgrade.name}`]}{upgrade.id < 0 && missingInApi}</>}>
            <span className={!unlocks.has(upgrade.id) ? styles.upgradeLocked : styles.upgrade}>
              {upgrade.iconId ? (
                <EntityIcon type={upgrade.iconType as 'skill'} icon={{ id: upgrade.iconId }} size={32}/>
              ) : upgrade.name === 'bauble_purse' ? (
                <img width={32} height={32} alt="" src={purseImg.src} style={{ imageRendering: 'pixelated' }}/>
              ) : upgrade.name === 'bauble_tote_bag' ? (
                <img width={32} height={32} alt="" src={toteBagImg.src} style={{ imageRendering: 'pixelated' }}/>
              ) : upgrade.name === 'bauble_backpack' ? (
                <img width={32} height={32} alt="" src={backpackImg.src} style={{ imageRendering: 'pixelated' }}/>
              ) : null}
              {upgrade.id < 0 && (<img width={32} height={32} alt="" src={questionmarkImg.src} className={styles.missingInApi}/>)}
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
  { id: 4, iconId: 563484, iconType: 'skill', name: 'bow' as const },
  { id: 6, iconId: 563482, iconType: 'skill', name: 'whip' as const },
  { id: -1, iconId: 563476, iconType: 'skill', name: 'boomerang' as const },
  { id: 9, iconId: 563486, iconType: 'skill', name: 'mini_bomb' as const },
  { id: 10, iconId: 563487, iconType: 'skill', name: 'mega_bomb' as const },
  { id: 12, iconId: 563489, iconType: 'skill', name: 'candle' as const },
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
  { id: 26, name: 'bauble_backpack' as const },
];


interface SabAccountTableSongsCellProps extends SabAccountsProps {
  songs: CharacterSabSong[],
}

const SabAccountTableSongsCell: FC<SabAccountTableSongsCellProps> = ({ songs, translations }) => {
  const unlocks = groupById(songs);

  const tip = (
    <ul className={styles.songsTip}>
      <li className={!unlocks.has(1) ? styles.songMissing : undefined}><Icon icon={unlocks.has(1) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.secret_song']} <span style={{ color: 'var(--color-text-muted)' }}>(1-2-3-1-2-3)</span></li>
      <li className={!unlocks.has(2) ? styles.songMissing : undefined}><Icon icon={unlocks.has(2) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.gatekeeper_lullaby']} <span style={{ color: 'var(--color-text-muted)' }}>(3-3-2-3-3-1)</span></li>
      <li className={!unlocks.has(3) ? styles.songMissing : undefined}><Icon icon={unlocks.has(3) ? 'checkmark' : 'cancel'}/> {translations['festival.super-adventure.sab.song.shatter_serenade']} <span style={{ color: 'var(--color-text-muted)' }}>(1-3-3-1-3-3)</span></li>
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
