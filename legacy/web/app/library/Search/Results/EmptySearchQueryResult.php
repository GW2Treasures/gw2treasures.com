<?php

class EmptySearchQueryResult extends SearchQueryResult {
    public function getResults() {
        return [];
    }

    public function getCount() {
        return 0;
    }

    public function render($data) {
        return 'Not implemented';
    }
}
