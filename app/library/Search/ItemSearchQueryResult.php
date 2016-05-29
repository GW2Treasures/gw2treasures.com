<?php

class ItemSearchQueryResult extends DatabaseSearchQueryResult {
    public function getQuery() {
        return $this->queryNameContains(Item::query(), $this->query->searchTerms)->orderBy('views', 'desc');
    }

    public function render($data) {
        return View::make('search.result.item', $data)->with('result', $this);
    }
}
