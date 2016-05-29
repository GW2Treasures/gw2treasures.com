<?php

class TraitSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(Traits::query(), $this->query->searchTerms);
    }

    public function render($data) {
        return View::make('search.result.generic', $data)->with('result', $this);
    }
}
