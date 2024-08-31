import { useDebounce } from '@/lib/useDebounce';
import { useMemo, useState, type Dispatch, type ReactNode, type ReactElement, type SetStateAction, type HTMLProps, useEffect } from 'react';
import { usePageResults, useSearchApiResults } from './useSearchResults';
import { Rarity } from '@gw2treasures/database';
import type { Weight } from '@/lib/types/weight';
import type { translations as itemTypeTranslations } from '../Item/ItemType.translations';
import type { TranslationSubset } from '@/lib/translate';
import type { IconProp } from '@gw2treasures/ui';
import { Tooltip } from '../Tooltip/Tooltip';
import { Rarity as RarityComponent } from '@/components/Item/Rarity';

type InteractiveSearchOption = {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  icon: IconProp;
  rightIcon?: IconProp;
  render?: (children: ReactElement<HTMLProps<HTMLElement>>) => ReactNode;
};

type SearchOption =
  | { type: 'header', id: string, title: ReactNode }
  | { type: 'button', onClick: () => void } & InteractiveSearchOption
  | { type: 'link', href: string } & InteractiveSearchOption
;

interface SearchState {
  input: string,
  setInput: Dispatch<SetStateAction<string>>,
  filter?: ReactNode[],

  options: SearchOption[]
}

type RequiredTranslations = TranslationSubset<
  | 'search.placeholder'
  | 'search.results.items'
  | 'search.results.skills'
  | 'search.results.skins'
  | 'search.results.achievements'
  | 'search.results.achievements.categories'
  | 'search.results.achievements.groups'
  | 'search.results.builds'
  | 'search.results.pages'
  | typeof itemTypeTranslations.short[0]
  | `rarity.${Rarity}`
  | `weight.${Weight}`
>;

type Filter<T = string> = {
  prefix: string,
  title: ReactNode,
  values: T[],
  render?(value: T): ReactNode,
  renderTag?(value: T): ReactNode,
};

const filters: Filter[] = [
  {
    prefix: 'rarity',
    title: 'Rarity',
    values: Object.values(Rarity),
    render: (rarity) => <RarityComponent key={rarity} rarity={rarity}/>,
    renderTag: (rarity) => <RarityComponent key={rarity} rarity={rarity}/>,
  } satisfies Filter<Rarity>,

  {
    prefix: 'weight',
    title: 'Weight',
    values: ['Light', 'Medium', 'Heavy'],
  } satisfies Filter<Weight>
];

type State =
  | { view: 'default' }
  | { view: 'advanced' }
  | { view: 'filter', filter: Filter };

export function useSearch(translations: RequiredTranslations, open: boolean): SearchState {
  const [state, setState] = useState<State>({ view: 'default' });

  // main search input text
  const [input, setInput] = useState('');

  // active advanced filters
  const [filter, setFilter] = useState<{ filter: string, value: string }[]>([]);

  // debounce input while user is typing
  const debouncedInput = useDebounce(input, 300);

  // construct query that is sent to the search API
  const query = useMemo(() => ({
    value: debouncedInput,
    filter
  }), [debouncedInput, filter]);

  useEffect(() => {
    if(!open) {
      setState({ view: 'default' });
    }
  }, [open]);

  const addFilter = (add: { filter: string, value: string }) => {
    setInput('');
    setState({ view: 'default' });
    setFilter((filter) => [
      ...filter.filter(({ filter, value }) => filter !== add.filter || value !== add.value),
      add
    ]);
  };

  const matchingFilters = (state.view === 'advanced' || (state.view === 'default' && input.length > 0))
    ? filters.filter(({ prefix }) => prefix.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()))
    : [];

  const matchingValues = (state.view === 'filter')
    ? state.filter.values.filter((value) => value.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()))
    : [];

  if(state.view === 'advanced') {
    return {
      input, setInput,

      options: [
        { id: 'back', type: 'button', title: 'Back', icon: 'chevron-left', onClick: () => setState({ view: 'default' }) },
        { id: 'advanced', type: 'header', title: 'Advanced Search' },
        ...matchingFilters.map((filter): SearchOption => ({ id: `filter.${filter.prefix}`, type: 'button', icon: 'filter', rightIcon: 'chevron-right', title: filter.title, onClick: () => { setInput(''); setState({ view: 'filter', filter }); } })),
      ]
    };
  }

  if(state.view === 'filter') {
    return {
      input, setInput,

      options: [
        { id: 'back', type: 'button', title: 'Back', icon: 'chevron-left', onClick: () => setState({ view: 'default' }) },
        { id: 'filter', type: 'header', title: state.filter.title },
        ...matchingValues.map((value): SearchOption => ({ id: `v${value}`, type: 'button', icon: 'info', title: state.filter.render ? state.filter.render(value) : value, onClick: () => addFilter({ filter: state.filter.prefix, value }) })),
      ]
    };
  }

  return {
    input, setInput,

    filter: query.filter.map(({ filter, value }) => filters.find(({ prefix }) => prefix === filter)?.renderTag?.(value) ?? `${capitalizeFirstLetter(filter)}: ${value}`),

    options: [
      { id: 'advanced', type: 'button', title: <div>Advanced Search</div>, icon: 'filter', rightIcon: 'chevron-right', onClick: () => { setInput(''); setState({ view: 'advanced' }); } },
      ...matchingFilters.map((filter): SearchOption => ({ id: `filter.${filter.prefix}`, type: 'button', icon: 'filter', rightIcon: 'chevron-right', title: filter.title, onClick: () => { setInput(''); setState({ view: 'filter', filter }); } })),
      { id: 'debug', type: 'header', title: 'Debug' },
      { id: 'debug.value', type: 'button', title: JSON.stringify(query.value), subtitle: 'Value', icon: 'developer', onClick: () => {} },
      { id: 'debug.filter', type: 'button', title: JSON.stringify(query.filter), subtitle: 'Filter', icon: 'developer', onClick: () => { setFilter([]); } },
      { id: 'test', type: 'header', title: 'Test' },
      { id: 'test.link', type: 'link', title: 'link', icon: 'developer', href: '/', render: (node) => <Tooltip content="Test">{node}</Tooltip> },
    ]
  };
}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
