'use client';

import { useDebounce } from '@/lib/useDebounce';
import { useJsonFetch } from '@/lib/useFetch';
import type { WithIcon } from '@/lib/with';
import type { Item } from '@gw2treasures/database';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { useState, type FC, useCallback, useMemo } from 'react';
import type { ApiItemSearchResponse } from '../api/item/search/route';
import { SkeletonTable } from '@/components/Skeleton/SkeletonTable';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { ItemLink } from '@/components/Item/ItemLink';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Rarity } from '@/components/Item/Rarity';
import { Coins } from '@/components/Format/Coins';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export interface ItemGuesserGameProps {
  challengeItem: WithIcon<Item>
}

export const ItemGuesserGame: FC<ItemGuesserGameProps> = ({ challengeItem }) => {
  const [guessedItems, setGuessedItems] = useState<number[]>([]);

  const [guessed, setGuessed] = useState({
    count: 0,
    hints: 0,
    correct: false,
    icon: false,
    rarity: false,
    type: false,
    subtype: false,
    weight: false,
    vendorValue: false,
    level: false,
  });

  const [guess, setGuess] = useState('');
  const debouncedValue = useDebounce(guess, 1000);

  const query = useMemo(() => {
    const query = new URLSearchParams();
    if(guessed.icon) { query.set('iconId', JSON.stringify(challengeItem.iconId)); }
    if(guessed.rarity) { query.set('rarity', challengeItem.rarity); }
    if(guessed.type) { query.set('type', challengeItem.type); }
    if(guessed.subtype) { query.set('subtype', JSON.stringify(challengeItem.subtype)); }
    if(guessed.weight) { query.set('weight', JSON.stringify(challengeItem.weight)); }
    if(guessed.vendorValue) { query.set('vendorValue', JSON.stringify(challengeItem.vendorValue)); }
    if(guessed.level) { query.set('level', JSON.stringify(challengeItem.level)); }

    return query;
  }, [guessed, challengeItem]);

  const search = useJsonFetch<ApiItemSearchResponse>(`/api/item/search?q=${encodeURIComponent(debouncedValue)}&${query.toString()}`);

  const handleGuess = useCallback((item: ApiItemSearchResponse['items'][0]) => {
    const correct = item.name_en === challengeItem.name_en;
    setGuessedItems((guessedItems) => [...guessedItems, item.id]);
    setGuessed((guessed) => ({
      count: guessed.count + 1,
      hints: guessed.hints,
      correct,
      icon: correct || guessed.icon || item.iconId === challengeItem.iconId,
      rarity: correct || guessed.rarity || item.rarity === challengeItem.rarity,
      type: correct || guessed.type || item.type === challengeItem.type,
      subtype: correct || guessed.subtype || item.subtype === challengeItem.subtype,
      weight: correct || guessed.weight || item.weight === challengeItem.weight,
      vendorValue: correct || guessed.vendorValue || item.vendorValue === challengeItem.vendorValue,
      level: correct || guessed.level || item.level === challengeItem.level,
    }));
  }, [challengeItem]);

  const handleHint = useCallback(() => {
    if(!guessed.type) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, type: true });
    } else if(!guessed.subtype && challengeItem.subtype) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, subtype: true });
    } else if(!guessed.weight && challengeItem.weight) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, weight: true });
    } else if(!guessed.rarity) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, rarity: true });
    } else if(!guessed.level) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, level: true });
    } else if(!guessed.vendorValue) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, vendorValue: true });
    } else if(!guessed.icon) {
      return setGuessed({ ...guessed, count: guessed.count + 1, hints: guessed.hints + 1, icon: true });
    } else {
      setGuess(challengeItem.name_en.substring(0, 1));
    }
  }, [challengeItem, guessed]);

  const unknown = <span style={{ color: 'var(--color-text-muted)' }}>?</span>;

  return (
    <div>
      <div style={{ background: guessed.correct ? 'var(--color-diff-added)' : 'var(--color-background-light)', padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, marginInline: 'auto' }}>
          <div>
            <Headline id="guess">Guess the Item</Headline>
          </div>

          <div>
            {guessed.correct ? <ItemLink item={challengeItem}/> : (
              <FlexRow>
                {guessed.icon ? <EntityIcon icon={challengeItem.icon!} size={32}/> : <Skeleton width={32} height={32}/>}
                <Skeleton/>
              </FlexRow>
            )}
          </div>

          <div>Rarity: {guessed.rarity ? <Rarity rarity={challengeItem.rarity}/> : unknown}</div>
          <div>Type: {guessed.type ? <>{challengeItem.type} {challengeItem.subtype && (guessed.subtype ? ` / ${challengeItem.subtype}` : <> / {unknown}</>)}</> : unknown}</div>
          {challengeItem.weight && guessed.type && <div>{guessed.weight ? challengeItem.weight : 'Unknown Weight'}</div>}
          <div>Vendor Value: {guessed.vendorValue ? (challengeItem.vendorValue === null ? 'Not sellable' : <Coins value={challengeItem.vendorValue}/>) : unknown}</div>
          <div>Level: {guessed.level ? challengeItem.level : unknown}</div>
        </div>
      </div>

      {guessed.correct ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, marginInline: 'auto', paddingBlock: 32 }}>
          You guessed correct after {guessed.count} guesses and {guessed.hints} hints!

          <div>
            <Button onClick={() => location.reload()}>Play again!</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, marginInline: 'auto', paddingBlock: 32 }}>
          <FlexRow align="space-between">
            <span>Guess ({guessed.count}):</span>
            <Button onClick={handleHint}>Hint</Button>
          </FlexRow>

          <TextInput value={guess} onChange={setGuess} placeholder="Name / Chatlink / ID" autoFocus/>

          {(debouncedValue.length === 0 && guessed.count === 0) ? null : search.loading ? (
            <SkeletonTable columns={['Item', 'Select']} rows={2}/>
          ) : search.data.items.length === 0 ? (
            <p>No items found</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Table.HeaderCell>Item</Table.HeaderCell>
                  <Table.HeaderCell small>Select</Table.HeaderCell>
                </tr>
              </thead>
              <tbody>
                {search.data.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <ItemLink item={item}/>
                    </td>
                    <td>
                      <Button onClick={() => handleGuess(item)} disabled={guessedItems.includes(item.id)}>Guess</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Headline id="howto">How to play</Headline>

          <p>Try to find the item by entering your guess in the text box above and selecting one of the suggestions. If your guess has any properties in common with the item in question, they will be revealed at the top. Use hints if you are stuck.</p>
        </div>
      )}
    </div>
  );
};
