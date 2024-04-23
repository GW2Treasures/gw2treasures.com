export async function createEntityMap<T extends { id: string | number }>(entities: T[] | Promise<T[]>): Promise<Map<T['id'], T>> {
  return new Map(
    (await entities)
      .map((entity) => [entity.id, entity])
  );
}
