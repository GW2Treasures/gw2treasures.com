<?php

class ItemSearchQueryResult extends DatabaseSearchQueryResult {
    public function getQuery() {
        return $this->queryNameContains(Item::query(), $this->getSearchTermsWithoutFilters())->orderBy('views', 'desc');
    }

    public function render($data) {
        return View::make('search.result.item', $data)->with('result', $this);
    }

    public function getInternalFilters() {
        $rarities = ['Junk','Basic','Fine','Masterwork','Rare','Exotic','Ascended','Legendary'];
        $rarityValues = array_combine($rarities, array_map(function($r) {
            return trans('item.rarity.'.$r);
        }, $rarities));

        $materials = Material::all();
        $materialValues = array_combine(
            $materials->fetch('id')->toArray(),
            $materials->map(function($material) { return $material->getName(); })->toArray()
        );

        return [
            'id' => new IntegerSearchQueryFilter('id'),
            'type' => new EnumSearchQueryFilter('type', $this->getItemTypes()),
            'level' => new RangeSearchQueryFilter('level'),
            'rarity' => new EnumSearchQueryFilter('rarity', $rarityValues),
            'pvp' => new BooleanSearchQueryFilter('pvp'),
            'material' => new EnumSearchQueryFilter('material', $materialValues, 'material_id')
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
