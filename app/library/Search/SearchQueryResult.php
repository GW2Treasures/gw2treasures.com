<?php

abstract class SearchQueryResult {
    protected $query;

    public function __construct(SearchQuery $query) {
        $this->query = $query;
    }

    public abstract function getResults();

    public abstract function getCount();

    public function hasResults() {
        return $this->getCount() > 0;
    }

    public abstract function render($data);

    public function renderEmpty($data) {
        return View::make('search.result.empty');
    }
}
