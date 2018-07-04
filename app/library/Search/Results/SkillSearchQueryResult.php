<?php

class SkillSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(Skill::query(),  $this->getSearchTermsWithoutFilters());
    }

    public function render($data) {
        return View::make('search.result.generic', $data)->with('result', $this);
    }

    protected function getInternalFilters() {
        return [
            'id' => new IntegerSearchQueryFilter('id'),
        ];
    }
}
