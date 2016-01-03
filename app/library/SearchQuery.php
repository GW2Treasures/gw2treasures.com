<?php

use Illuminate\Database\Query\Builder;

class SearchQuery {
    public $searchTerm;

    /** @var \Illuminate\Pagination\Paginator */
    protected $results;

    public function __construct($searchTerm) {
        $this->searchTerm = $searchTerm;
    }

    public function getQuery() {
        // search terms
        $query = Item::where(function($query) {
            foreach($this->splitSearchTerms() as $searchTerm) {
                $searchTerm = trim($searchTerm, '"');
                $query = $this->queryOrWhereStringContains($query, 'name_de', $searchTerm);
                $query = $this->queryOrWhereStringContains($query, 'name_en', $searchTerm);
                $query = $this->queryOrWhereStringContains($query, 'name_es', $searchTerm);
                $query = $this->queryOrWhereStringContains($query, 'name_fr', $searchTerm);
            }
        });

        return $query->remember(3);
    }

    public function getResults() {
        if(!isset($this->results)) {
            return $this->results = $this->getQuery()->paginate(50)->appends(
                Input::only(['q'])
            );
        }

        return $this->results;
    }

    public function hasResults() {
        return $this->getResults()->getTotal() > 0;
    }

    public function renderResults() {
        return View::make('item.search.index')->with('query', $this);
    }

    protected function splitSearchTerms() {
        preg_match_all('/"(?:\\\\.|[^\\\\"])*"|\S+/', $this->searchTerm, $matches);
        return $matches[0];
    }

    /**
     * @param Builder $query
     * @param string  $column
     * @param string  $value
     * @param string  $boolean
     * @return Builder
     */
    protected function queryWhereStringContains($query, $column, $value, $boolean = 'and') {
        // custom escape character (backslashes get really weird with with quadruple escapes…)
        $e = '=';

        // escape the escape char and wildcards
        $replacements = [
            $e  => $e.$e,
            '%' => $e.'%',
            '_' => $e.'_'
        ];
        $value = '%'.strtr( $value, $replacements ).'%';

        // run the query
        return $query->whereRaw("UPPER(`$column`) LIKE ? ESCAPE '$e'", [$value], $boolean);
    }

    /**
     * @param Builder $query
     * @param string  $column
     * @param string  $value
     * @return Builder
     */
    protected function queryOrWhereStringContains($query, $column, $value) {
        return $this->queryWhereStringContains($query, $column, $value, 'or');
    }
}
