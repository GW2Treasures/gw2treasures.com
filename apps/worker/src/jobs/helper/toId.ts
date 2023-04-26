export function toId<Id>({ id }: { id: Id }): Id {
  return id;
}

export function mapAllToIds<Id>(array: { id: Id }[]): Id[] {
  return array.map(toId);
}
