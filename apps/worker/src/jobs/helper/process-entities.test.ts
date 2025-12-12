import { Build, Prisma, Revision } from '@gw2treasures/database';
import { randomUUID } from 'node:crypto';
import { afterAll, describe, expect, test, vi } from 'vitest';
import { db } from '../../db';
import { InputDataLocalized, processLocalizedEntities } from './process-entities';
import { createRevisionHash } from './revision';
import { LocalizedObject } from './types';

function loadFromApi<T extends { id: number }>(entity: T) {
  return Promise.resolve(new Map<number, LocalizedObject<T>>([[entity.id, { de: entity, en: entity, es: entity, fr: entity }]]));
}

vi.mock('./revision-create', () => ({
  createRevision: (data: Prisma.RevisionUncheckedCreateInput) => Promise.resolve({ id: `test-${data.type}-${randomUUID()}` })
}));

vi.mock('./getCurrentBuild', () => ({
  getCurrentBuild: () => Promise.resolve({ id: 1, createdAt: new Date(), updatedAt: new Date() } satisfies Build)
}));

// mock db.$transaction
const originalTransaction = db.$transaction;
db.$transaction = vi.fn((fn) => fn(db));
afterAll(() => { db.$transaction = originalTransaction; });

type TestDbEntity = {
  id: number,
  current_de: Revision,
  current_en: Revision,
  current_es: Revision,
  current_fr: Revision,
  removedFromApi: boolean,
  version: number,
};

const revisionBase: Revision = { buildId: 1, schema: 'test', createdAt: new Date(), data: '{"id":1}', hash: createRevisionHash('{"id":1}'), description: 'Test', entity: 'test', id: 'test-revision', language: 'en', type: 'Import', previousRevisionId: null };

const TestDbEntityBase: TestDbEntity = {
  id: 1,
  current_de: revisionBase,
  current_en: revisionBase,
  current_es: revisionBase,
  current_fr: revisionBase,
  removedFromApi: false,
  version: 1,
};

async function testProcessLocalizedEntities(
  dbEntity: Partial<TestDbEntity> | undefined, apiEntity: object | undefined
): Promise<
  | { create: InputDataLocalized<number, { testId_revisionId: { testId: string, revisionId: string }}>, update: never }
  | { update: InputDataLocalized<number, { testId_revisionId: { testId: string, revisionId: string }}>, create: never }
  | undefined
>{
  let data = undefined;

  await processLocalizedEntities(
    { ids: [1] },
    'test',
    () => apiEntity ? loadFromApi({ id: 1, ...apiEntity }) : Promise.resolve(new Map()), // get from api
    (testId, revisionId) => ({ testId_revisionId: { testId, revisionId }}),
    () => ({}), // migrate
    () => Promise.resolve(dbEntity ? [{ ...TestDbEntityBase, ...dbEntity }] : []), // get from db
    (_, create) => {
      data = { create: create.data };
      return Promise.resolve();
    },
    (_, update) => {
      data = { update: update.data };
      return Promise.resolve();
    },
    1
  );

  return data;
}

describe('process-entities', () => {
  test('new', async () => {
    const data = await testProcessLocalizedEntities(undefined, {});
    expect(data).toMatchObject({ create: { id: 1, removedFromApi: false }});
    expect(data!.create.currentId_en).toMatch(/^test-Added-/);
  });

  test('removed', async () => {
    const data = await testProcessLocalizedEntities({}, undefined);
    expect(data?.update).toMatchObject({ removedFromApi: true });
    expect(data?.update.currentId_en).toMatch(/^test-Removed-/);
  });

  test('no changes', async () => {
    const data = await testProcessLocalizedEntities({}, {});
    expect(data).toBeDefined();
    expect(data).toHaveProperty('update.lastCheckedAt');
    expect(Object.keys(data!.update)).toHaveLength(1);
  });

  test('updated', async () => {
    const data = await testProcessLocalizedEntities({}, { updated: true });
    expect(data?.update).toBeDefined();
    expect(data?.update.currentId_en).toMatch(/^test-Update-/);
  });

  test('rediscovered', async () => {
    const data = await testProcessLocalizedEntities({ removedFromApi: true }, { updated: true });
    expect(data?.update).toMatchObject({ removedFromApi: false });
    expect(data?.update.currentId_en).toMatch(/^test-Update-/);
  });

  test('migration', async () => {
    const data = await testProcessLocalizedEntities({ version: 0 }, {});
    expect(data?.update).toMatchObject({ currentId_en: TestDbEntityBase.current_en.id, version: 1 });
  });

  // TODO: add tests for processEntities (not localized)
});
