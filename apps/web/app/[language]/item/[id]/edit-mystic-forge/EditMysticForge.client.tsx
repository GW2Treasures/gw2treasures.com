'use client';

import { DialogActions } from '@gw2treasures/ui/components/Dialog/DialogActions';;
import { ItemLink } from '@/components/Item/ItemLink';
import { SearchItemDialog, type SearchItemDialogSubmitHandler } from '@/components/Item/SearchItemDialog';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { MysticForgeRecipe, Rarity } from '@gw2treasures/database';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { NumberInput } from '@gw2treasures/ui/components/Form/NumberInput';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { useState, type FC, useCallback, useActionState } from 'react';
import { submitEditMysticForge } from './action';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

type ItemType = WithIcon<LocalizedEntity> & { id: number, rarity: Rarity };
type ItemIngredient = { count: number, Item: ItemType };

export interface EditMysticForgeClientProps {
  outputItem: ItemType;
  recipe?: Pick<MysticForgeRecipe, 'id' | 'outputCountMin' | 'outputCountMax'> & { itemIngredients: ItemIngredient[] };
}

export const EditMysticForgeClient: FC<EditMysticForgeClientProps> = ({ outputItem, recipe }) => {
  const [outputCountMin, setOutputCountMin] = useState(recipe?.outputCountMin);
  const [outputCountMax, setOutputCountMax] = useState(recipe?.outputCountMax);

  const [ingredients, setIngredients] = useState<(ItemIngredient | undefined)[]>(
    recipe?.itemIngredients ?? [undefined, undefined, undefined, undefined]
  );

  const [editIngredient, setEditIngredient] = useState<number>();

  const updateIngredient = useCallback((index: number, update: Partial<ItemIngredient>) => {
    setIngredients((ingredients) => ingredients.map((ingredient, i) => i === index ? { count: 1, Item: undefined!, ...ingredient, ...update } : ingredient));
  }, []);

  const handleEditIngredient = useCallback<SearchItemDialogSubmitHandler>((item) => {
    if(item && editIngredient !== undefined) {
      updateIngredient(editIngredient, { Item: item });
    }

    setEditIngredient(undefined);
  }, [editIngredient, updateIngredient]);

  const [formState, submit, isPending] = useActionState(submitEditMysticForge, undefined);

  const handleSubmit = useCallback(() => {
    submit({
      recipeId: recipe?.id,
      outputItemId: outputItem.id,
      outputCountMin, outputCountMax,
      ingredients: ingredients.map((ingredient) => ({ itemId: ingredient?.Item.id, count: ingredient?.count }))
    });
  }, [ingredients, outputCountMax, outputCountMin, outputItem.id, recipe?.id, submit]);

  if(formState?.success) {
    return <p>You changes were submitted.</p>;
  }

  return (
    <>
      {formState?.error && (
        <Notice type="error">{formState.error}</Notice>
      )}
      <SearchItemDialog open={editIngredient !== undefined} onSubmit={handleEditIngredient}/>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Output Item</Table.HeaderCell>
            <Table.HeaderCell small>Min. Quantity</Table.HeaderCell>
            <Table.HeaderCell small>Max. Quantity</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><ItemLink item={outputItem}/></td>
            <td><NumberInput value={outputCountMin} onChange={setOutputCountMin} min={0} max={250}/></td>
            <td><NumberInput value={outputCountMax} onChange={setOutputCountMax} min={1} max={250}/></td>
          </tr>
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Input Item</Table.HeaderCell>
            <Table.HeaderCell small/>
            <Table.HeaderCell small>Quantity</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3].map((id) => ({ id, ingredient: ingredients[id] })).map(({ id, ingredient }) => ingredient ? (
            <tr key={id}>
              <td><ItemLink item={ingredient.Item}/></td>
              <td><Button icon="item" onClick={() => setEditIngredient(id)}>Change</Button></td>
              <td><NumberInput value={ingredient.count} onChange={(count) => updateIngredient(id, { count })}/></td>
            </tr>
          ) : (
            <tr key={id}>
              <td colSpan={2}><Button icon="item" onClick={() => setEditIngredient(id)}>Select item</Button></td>
              <td><NumberInput readOnly/></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <DialogActions description="Your changes will be reviewed before they are applied.">
        <Button onClick={handleSubmit} disabled={isPending}>Submit</Button>
      </DialogActions>
    </>
  );
};
