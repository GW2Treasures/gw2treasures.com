
/** Generate a range starting at 0 up to but not including end. */
export function range<End extends SmallInteger>(end: End): Range<0, End>;

/** Generate a range starting at 0 up to but not including end. */
export function range(end: number): number[];

/** Generate a range including start up to but not including end. */
export function range<Start extends SmallInteger, End extends SmallInteger>(start: Start, end: End): Range<Start, End>;

/** Generate a range including start up to but not including end. */
export function range(start: number, end: number): number[];

export function range(start: number, end?: number): number[] {
  const [from, to] = end === undefined ? [0, start] : [start, end];

  return [...Array(to - from).keys()].map((i) => i + from);
}


type BuildTuple<Length extends SmallInteger, Acc extends number[] = []> =
  Acc['length'] extends Length ? Acc : BuildTuple<Length, [...Acc, Acc['length']]>;

type DropUntil<Start extends SmallInteger, Acc extends number[], Dropped extends SmallInteger[] = []> =
  Dropped['length'] extends Start ? Acc : DropUntil<Start, Acc extends [infer _, ...infer Rest] ? Rest : [], [...Dropped, 0]>;

type Range<Start extends SmallInteger, End extends SmallInteger> =
  DropUntil<Start, BuildTuple<End>>;

type SmallInteger = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
