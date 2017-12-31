<?php

class SpecializationSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(Specialization::query(), $this->query->searchTerms);
    }

    public function render($data) {
        return View::make('search.result.generic', $data)->with('result', $this);
    }
}
