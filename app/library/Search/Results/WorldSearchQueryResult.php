<?php

class WorldSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(World::query(), $this->query->searchTerms);
    }

    public function render($data) {
        return View::make('search.result.world', $data)->with('result', $this);
    }

    protected function getPageSize() {
        return 10;
    }
}
