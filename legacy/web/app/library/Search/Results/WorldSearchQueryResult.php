<?php

class WorldSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(World::query(), $this->getSearchTermsWithoutFilters());
    }

    public function render($data) {
        return View::make('search.result.world', $data)
            ->with('result', $this)
            ->with('columns', WvWController::getColumns());
    }

    protected function getPageSize() {
        return 10;
    }

    protected function getInternalFilters() {
        return [
            'id' => new IntegerSearchQueryFilter('id'),
        ];
    }
}
