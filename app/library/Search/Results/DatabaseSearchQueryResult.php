<?php

use Illuminate\Database\Query\Builder;

abstract class DatabaseSearchQueryResult extends SearchQueryResult {
    /** @var \Illuminate\Pagination\Paginator */
    protected $_results = null;
    protected $_count = null;

    /**
     * @return \Illuminate\Database\Query\Builder
     */
    protected abstract function getQuery();

    public function getCount() {
        if($this->_results != null) {
            return $this->_results->count();
        }

        if($this->_count == null) {
            $this->_count = $this->filterQuery($this->getQuery())->remember(5)->count();
        }

        return $this->_count;
    }

    public function getResults() {
        if($this->_results == null) {
            $this->_results = $this->filterQuery($this->getQuery())->remember(5)->paginate($this->getPageSize())->appends('q', $this->query->searchTerm);
        }

        return $this->_results;
    }

    public function getResultArray($count) {
        return $this->filterQuery($this->getQuery())->remember(5)->limit($count)->get();
    }

    protected function filterQuery($query) {
        foreach($this->getFilters() as $filter) {
            $query = $filter->query($query);
        }

        return $query;
    }

    public function hasResults() {
        return $this->getCount() > 0;
    }

    protected function getPageSize() {
        return 50;
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
        $value = '%'.strtoupper(strtr( $value, $replacements )).'%';

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

    /**
     * @param Builder  $query
     * @param string[] $searchTerms
     * @return Builder
     */
    protected function queryNameContains($query, $searchTerms) {
        return $query->orWhere(function($query) use ($searchTerms) {
            foreach($searchTerms as $searchTerm) {
                $query = $query->where(function($query) use($searchTerm) {
                    $query = $this->queryOrWhereStringContains($query, 'name_de', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_en', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_es', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_fr', $searchTerm);

                    return $query;
                });
            }
        });
    }
}
