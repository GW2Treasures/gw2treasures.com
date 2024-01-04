import { randomUUID } from 'crypto';
import { InputData, processLocalizedEntities } from './process-entitites';
import { LocalizedObject } from './types';
import { Build, Prisma, Revision } from '@gw2treasures/database';
import { db } from '../../db';

function loadFromApi<T extends { id: number }>(entity: T) {
  return Promise.resolve(new Map<number, LocalizedObject<T>>([[entity.id, { de: entity, en: entity, es: entity, fr: entity }]]));
}

jest.mock('./revision-create', () => ({
  createRevision: (data: Prisma.RevisionUncheckedCreateInput) => Promise.resolve({ id: `test-${data.type}-${randomUUID()}` })
}));

jest.mock('./getCurrentBuild', () => ({
  getCurrentBuild: () => Promise.resolve({ id: 1, createdAt: new Date(), updatedAt: new Date() } satisfies Build)
}));

// mock db.$transaction
const originalTransaction = db.$transaction;
// @ts-expect-error doesnt match the $transaction signature
db.$transaction = jest.fn((fn) => fn(db));
afterAll(() => { db.$transaction = originalTransaction; });

type TestDbEntity = {
  id: number,
  current_de: Revision,
  current_en: Revision,
  current_es: Revision,
  current_fr: Revision,
  removedFromApi: boolean,
  version: number,
}

const revisionBase: Revision = { buildId: 1, createdAt: new Date(), data: JSON.stringify({ id: 1 }), description: 'Test', entity: 'test', id: 'test-revision', language: 'en', type: 'Import', previousRevisionId: null };

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
  | { create: InputData<number, { testId_revisionId: { testId: string, revisionId: string }}>, update: never }
  | { update: InputData<number, { testId_revisionId: { testId: string, revisionId: string }}>, create: never }
  | undefined
>{
  let data = undefined;

  await processLocalizedEntities(
    { ids: [1] },
    'test',
    (testId, revisionId) => ({ testId_revisionId: { testId, revisionId }}),
    () => ({}), // migrate
    () => Promise.resolve(dbEntity ? [{ ...TestDbEntityBase, ...dbEntity }] : []), // get from db
    () => apiEntity ? loadFromApi({ id: 1, ...apiEntity }) : Promise.resolve(new Map()), // get from api
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
});
