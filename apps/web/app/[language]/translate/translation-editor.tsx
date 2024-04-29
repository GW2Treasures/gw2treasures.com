'use client';

import { Dialog } from '@gw2treasures/ui/components/Dialog/Dialog';
import { Code } from '@/components/Layout/Code';
import type { TranslationId } from '@/lib/translate';
import { Language } from '@gw2treasures/database';
import { isTruthy } from '@gw2treasures/helper/is';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { TextInput } from '@gw2treasures/ui/components/Form/TextInput';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { useState, type FC, useCallback, useMemo } from 'react';

export interface TranslationEditorProps {
  dictionaries: {
    de: Partial<Record<TranslationId, string>>,
    en: Record<TranslationId, string>,
    es: Partial<Record<TranslationId, string>>,
    fr: Partial<Record<TranslationId, string>>,
  }
  legacyDictionaries: {
    de: Record<string, string>,
    en: Record<string, string>,
    es: Record<string, string>,
    fr: Record<string, string>,
  }
}

export const TranslationEditor: FC<TranslationEditorProps> = ({ dictionaries, legacyDictionaries }) => {
  const keys = Object.keys(dictionaries.en) as TranslationId[];

  const [changes, setChanges] = useState<Record<Language, Partial<Record<TranslationId, string>>>>({ de: {}, en: {}, es: {}, fr: {}});
  const [edit, setEdit] = useState<{ language: Language, key: TranslationId, value: string }>();

  const handleExport = useCallback((language: Language) => {
    const json = JSON.stringify(
      Object.fromEntries(
        keys.map((id) => [id, changes[language][id] ?? dictionaries[language][id]])
      ),
      null, 2
    );

    const download = document.createElement('a');
    download.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(json + '\n')}`);
    download.setAttribute('download', `${language}.json`);
    document.body.append(download);
    download.click();
    download.remove();
  }, [changes, dictionaries, keys]);

  const suggestions = useMemo(() => edit?.key
    ? Array.from(new Set([
        ...Object.entries(dictionaries.de).filter(([id, value]) => id !== edit.key && (value === dictionaries.de[edit.key] || value === changes.de[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.en).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.en[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.es).filter(([id, value]) => id !== edit.key && (value === dictionaries.es[edit.key] || value === changes.es[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.fr).filter(([id, value]) => id !== edit.key && (value === dictionaries.fr[edit.key] || value === changes.fr[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(changes.de).filter(([id, value]) => id !== edit.key && (value === dictionaries.de[edit.key] || value === changes.de[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.en).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.en[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.es).filter(([id, value]) => id !== edit.key && (value === dictionaries.es[edit.key] || value === changes.es[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.fr).filter(([id, value]) => id !== edit.key && (value === dictionaries.fr[edit.key] || value === changes.fr[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(legacyDictionaries.de).filter(([id, value]) => id !== edit.key && (value === dictionaries.de[edit.key] || value === changes.de[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => legacyDictionaries[edit.language][id]),
        ...Object.entries(legacyDictionaries.en).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.en[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => legacyDictionaries[edit.language][id]),
        ...Object.entries(legacyDictionaries.es).filter(([id, value]) => id !== edit.key && (value === dictionaries.es[edit.key] || value === changes.es[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => legacyDictionaries[edit.language][id]),
        ...Object.entries(legacyDictionaries.fr).filter(([id, value]) => id !== edit.key && (value === dictionaries.fr[edit.key] || value === changes.fr[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => legacyDictionaries[edit.language][id]),
      ].filter(isTruthy)))
    : [],
    [dictionaries, legacyDictionaries, changes, edit]
  );

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>English</th>
            <th>Deutsch</th>
            <th>Español</th>
            <th>Français</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: 'var(--color-background-light)' }}>
            <th/>
            <th><Button onClick={() => handleExport('en')}>Export</Button></th>
            <th><Button onClick={() => handleExport('de')}>Export</Button></th>
            <th><Button onClick={() => handleExport('es')}>Export</Button></th>
            <th><Button onClick={() => handleExport('fr')}>Export</Button></th>
          </tr>
          {keys.map((key) => (
            <tr key={key}>
              <th><Code inline borderless>{key}</Code></th>
              <td><TranslationButton language="en" id={key} dictionaries={dictionaries} changes={changes} onEdit={setEdit}/></td>
              <td><TranslationButton language="de" id={key} dictionaries={dictionaries} changes={changes} onEdit={setEdit}/></td>
              <td><TranslationButton language="es" id={key} dictionaries={dictionaries} changes={changes} onEdit={setEdit}/></td>
              <td><TranslationButton language="fr" id={key} dictionaries={dictionaries} changes={changes} onEdit={setEdit}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Dialog open={!!edit} title={`Edit "${edit?.key}" (${edit?.language})`} onClose={() => setEdit(undefined)}>
        {edit && (
          <>
            <FlexRow>
              <TextInput value={edit.value} onChange={(value) => setEdit({ ...edit, value })} autoFocus/>
              <Button onClick={() => { setChanges({ ...changes, [edit.language]: { ...changes[edit.language], [edit.key]: edit.value === '' || edit.value === dictionaries[edit.language][edit.key] ? undefined : edit.value }}); setEdit(undefined); }}>Save</Button>
            </FlexRow>
            {suggestions.length > 0 && (
              <>
                <div style={{ fontWeight: 500, marginBlock: 16 }}>Suggestions</div>
                <MenuList>
                  {suggestions.map((suggestion) => (
                    <Button key={suggestion} appearance="menu" onClick={() => setEdit({ ...edit, value: suggestion })}>{suggestion}</Button>
                  ))}
                </MenuList>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};

export interface TranslationButtonProps {
  language: Language;
  id: TranslationId;
  dictionaries: Record<Language, Partial<Record<TranslationId, string>>>
  changes: Record<Language, Partial<Record<TranslationId, string>>>
  onEdit: (edit: { language: Language, key: TranslationId, value: string }) => void;
}

export const TranslationButton: FC<TranslationButtonProps> = ({ language, id, dictionaries, changes, onEdit }) => {
  const isChanged = changes[language][id] !== undefined;
  const isFallback = !isChanged && dictionaries[language][id] === undefined;

  return (
    <Button appearance="menu" iconOnly onClick={() => onEdit({ language, key: id, value: changes[language][id] ?? dictionaries[language][id] ?? '' })}>
      <span style={isFallback ? { color: 'var(--color-text-muted)', fontStyle: 'italic' } : isChanged ? { color: 'var(--color-focus)', fontWeight: 500 } : undefined}>
        {changes[language][id] ?? dictionaries[language][id] ?? dictionaries.en[id]}
      </span>
    </Button>
  );
};
