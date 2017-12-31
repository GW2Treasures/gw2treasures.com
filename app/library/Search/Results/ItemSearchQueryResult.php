<?php

class ItemSearchQueryResult extends DatabaseSearchQueryResult {
    public function getQuery() {
        return $this->queryNameContains(Item::query(), $this->getSearchTermsWithoutFilters())->orderBy('views', 'desc');
    }

    public function render($data) {
        return View::make('search.result.item', $data)->with('result', $this);
    }

    public function getInternalFilters() {
        $rarities = ['Ascended','Basic','Exotic','Fine','Junk','Legendary','Masterwork','Rare'];

        return [
            'id' => new IntegerSearchQueryFilter('id'),
            'type' => new EnumSearchQueryFilter('type', $this->getItemTypes()),
            'level' => new RangeSearchQueryFilter('level'),
            'rarity' => new EnumSearchQueryFilter('rarity', array_combine($rarities, $rarities)),
            'pvp' => new BooleanSearchQueryFilter('pvp'),
        ];
    }

    protected function getItemTypes() {
        $dbTypes = Cache::remember('item.search.filter.types', 60 * 24 * 3, function() {
            return Item::groupBy('type')->lists('type');
        });

        $types = [];
        foreach($dbTypes as $type) {
            if($type !== '' && $type !== 'None') {
                $types[$type] = trans('item.type.'.$type);
            }
        }

        return $types;
    }
}
