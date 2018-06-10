<?php

class AchievementSearchQueryResult extends DatabaseSearchQueryResult {
    protected function getQuery() {
        return $this->queryNameContains(Achievement::query(), $this->getSearchTermsWithoutFilters())->with('category');
    }

    public function render($data) {
        return View::make('search.result.generic', $data)->with('result', $this);
    }

    public function getInternalFilters() {
        return [
            'mastery' => new AchievementMasteryQueryFilter('mastery')
        ];
    }
}
